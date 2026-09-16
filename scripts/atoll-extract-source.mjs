#!/usr/bin/env node
// Read-only Drupal + live-site + Sanity inventory. Never mutates Sanity.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createClient} from '@sanity/client';
import {parseNeededTables} from './atoll-source-utils.mjs';

const root=process.cwd();
const cache=path.join(root,'.migration-cache');
await fs.mkdir(cache,{recursive:true});
for(const file of ['.env.local','.env']) {
  try { for(const line of (await fs.readFile(file,'utf8')).split('\n')) {
    const match=line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if(match&&!process.env[match[1]]) process.env[match[1]]=match[2].trim().replace(/^['"]|['"]$/g,'').replace(/\\n$/,'');
  }} catch {}
}
const sqlFile=(await fs.readdir(path.join(root,'.tetiaroa_old/db'))).filter(f=>f.endsWith('.sql')).sort().at(-1);
let tables;
try { if(process.argv.includes('--refresh'))throw new Error('Refresh requested'); tables=JSON.parse(await fs.readFile(path.join(cache,'atoll-drupal-tables.json'),'utf8')); }
catch { const sql=await fs.readFile(path.join(root,'.tetiaroa_old/db',sqlFile),'utf8');
const names=[...sql.matchAll(/CREATE TABLE `(node__[^`]+|media__[^`]+|node_field_data|path_alias|file_managed|taxonomy_term_field_data|media_field_data|media)`/g)].map(m=>m[1]);
tables=parseNeededTables(sql,names);
await fs.writeFile(path.join(cache,'atoll-drupal-tables.json'),JSON.stringify(tables)); }
console.log(`Parsed ${Object.keys(tables).length} Drupal tables.`);
try { if(process.argv.includes('--refresh'))throw new Error('Refresh requested');await fs.access(path.join(cache,'atoll-paragraph-tables.json')); }
catch {const sql=await fs.readFile(path.join(root,'.tetiaroa_old/db',sqlFile),'utf8');const names=[...sql.matchAll(/CREATE TABLE `(paragraph__[^`]+|paragraphs_item_field_data)`/g)].map(m=>m[1]);await fs.writeFile(path.join(cache,'atoll-paragraph-tables.json'),JSON.stringify(parseNeededTables(sql,names)));}
const client=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET,token:process.env.SANITY_API_TOKEN??process.env.SANITY_WRITE_TOKEN,apiVersion:'2026-07-02',useCdn:false});
const sanity=await client.fetch('*[_type == "impactEntry"]');
await fs.writeFile(path.join(cache,'atoll-existing-impact.json'),JSON.stringify(sanity,null,2));
const categories=['birds','plants','fish','turtles','marine-mammals','invertebrates'];
const strip=s=>String(s??'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#039;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
const live=[];
await Promise.all(categories.map(async category=>{
  const url=`https://www.tetiaroasociety.org/island/${category}`;
  const html=await (await fetch(url)).text();
  await fs.writeFile(path.join(cache,`atoll-live-${category}.html`),html);
  const links=[...new Set([...html.matchAll(/href="(\/island\/[^"?#]+)"/g)].map(m=>m[1]).filter(p=>p.split('/').filter(Boolean).length===3))];
  for(const alias of links) {
    const offset=html.indexOf(`href="${alias}"`);
    const prefix=html.slice(0,offset);
    const heading=[...prefix.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].at(-1)?.[1]??'';
    live.push({category,alias,subgroup:strip(heading)});
  }
}));
const nodeRows=tables.node_field_data;
const aliases=tables.path_alias;
const assetCache=JSON.parse(await fs.readFile(path.join(cache,'drupal-impact-assets.json'),'utf8').catch(()=>'{}'));
const files=new Map(tables.file_managed.map(f=>[f.fid,{...f,sanityAsset:assetCache[`image:${f.fid}:${f.changed}`]??assetCache[`file:${f.fid}:${f.changed}`]}]));
const fieldsFor=(nid,language)=>Object.fromEntries(Object.entries(tables).filter(([n])=>n.startsWith('node__')).map(([name,rows])=>[name.replace('node__',''),rows.filter(r=>r.entity_id===nid&&r.langcode===language&&!r.deleted)]).filter(([,rows])=>rows.length));
const sourceFor=(nid,language)=>{
  const row=nodeRows.find(r=>r.nid===nid&&r.langcode===language);
  if(!row)return null;
  const fields=fieldsFor(nid,language);
  const htmlFields=Object.entries(fields).flatMap(([name,rows])=>rows.flatMap(r=>Object.entries(r).filter(([k,v])=>k.endsWith('_value')&&typeof v==='string').map(([key,html])=>({field:name,key,html,text:strip(html)}))));
  const existing=sanity.find(s=>s.legacyNodeId===nid&&s.language===language)??sanity.find(s=>s.legacyNodeId===nid&&s[language==='fr'?'french':'english']);
  const existingSanity=existing?{_id:existing._id,...(existing.language===language?existing:existing[language==='fr'?'french':'english']??existing)}:null;
  return {title:row.title,changed:row.changed,status:row.status,fields,htmlFields,plainText:htmlFields.map(f=>`${f.field}: ${f.text}`).join('\n\n'),existingSanity};
};
const profiles=live.map(item=>{
  const alias=aliases.find(a=>a.alias===item.alias&&a.langcode==='en');
  if(!alias)throw new Error(`No SQL alias for ${item.alias}`);
  const nid=Number(alias.path.split('/').at(-1));
  const locales={en:sourceFor(nid,'en'),fr:sourceFor(nid,'fr')};
  const nodeAliases=Object.fromEntries(['en','fr'].map(language=>[language,aliases.filter(a=>a.path===`/node/${nid}`&&a.langcode===language).map(a=>a.alias)]));
  const media=[...new Set(Object.values(locales).filter(Boolean).flatMap(l=>Object.values(l.fields).flat().flatMap(r=>Object.entries(r).filter(([k,v])=>k.endsWith('_target_id')&&files.has(v)).map(([,v])=>v))))].map(fid=>files.get(fid));
  return {nid,...item,slug:item.alias.split('/').at(-1),aliases:nodeAliases,public:true,locales,media};
}).sort((a,b)=>a.nid-b.nid);
const publicIds=new Set(profiles.map(p=>p.nid));
const drafts=nodeRows.filter(n=>n.langcode==='en'&&n.type==='guide_content'&&!publicIds.has(n.nid)).map(n=>({nid:n.nid,public:false,locales:{en:sourceFor(n.nid,'en'),fr:sourceFor(n.nid,'fr')}}));
const hub=await(await fetch('https://www.tetiaroasociety.org/island')).text();
await fs.writeFile(path.join(cache,'atoll-live-hub.html'),hub);
const hubLinks=[...new Set([...hub.matchAll(/href="([^"?#]+)"/g)].map(m=>m[1]))];
const biosphere=hubLinks.filter(link=>/^\/biosphere-tetiaroa\//.test(link)).map(alias=>({alias,nid:Number(aliases.find(a=>a.alias===alias&&a.langcode==='en')?.path.split('/').at(-1))})).map(item=>({...item,locales:{en:sourceFor(item.nid,'en'),fr:sourceFor(item.nid,'fr')}}));
const categorySources=categories.map(category=>{const nid=Number(aliases.find(a=>a.alias===`/island/${category}`&&a.langcode==='en')?.path.split('/').at(-1));return {category,nid,locales:{en:sourceFor(nid,'en'),fr:sourceFor(nid,'fr')}}});
const inventory={counts:Object.fromEntries(categories.map(c=>[c,profiles.filter(p=>p.category===c).length])),publicProfiles:profiles.length,translations:profiles.filter(p=>p.locales.fr).length,drafts:drafts.length,biosphere:biosphere.length};
await fs.writeFile(path.join(cache,'atoll-source.json'),JSON.stringify({generatedAt:new Date().toISOString(),sqlFile,inventory,profiles,drafts,categories:categorySources,biosphere},null,2));
console.log(JSON.stringify(inventory,null,2));
await import('./atoll-enrich-source.mjs');
