#!/usr/bin/env node
// Capture the current public pages before rewriting; audit text and media.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const cache='.migration-cache';
const source=JSON.parse(await fs.readFile(`${cache}/atoll-source.json`,'utf8'));
await fs.mkdir(`${cache}/atoll-live`,{recursive:true});
const decode=s=>s.replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&#039;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)));
const strip=s=>decode(s.replace(/<[^>]*>/g,' ')).normalize('NFKC').replace(/\s+/g,' ').trim();
const records=[];
const pending=source.profiles.flatMap(profile=>['en','fr'].map(language=>({profile,language})));
async function audit({profile,language}) {
  const alias=profile.aliases[language]?.at(-1)??profile.alias;
  const url=`https://www.tetiaroasociety.org${language==='fr'?'/fr':''}${alias}`;
  const cacheFile=`${cache}/atoll-live/${profile.nid}-${language}.html`;
  let html;
  try {html=await fs.readFile(cacheFile,'utf8');} catch {const response=await fetch(url);if(!response.ok)throw new Error(`${url}: ${response.status}`);html=await response.text();await fs.writeFile(cacheFile,html);}
  const plain=strip(html);
  const missingText=profile.locales[language].htmlFields.filter(f=>f.text.length>30&&!/source|sprout|video|meta|flippy|sort/.test(f.field)).filter(f=>!plain.includes(strip(f.html))).map(f=>({field:f.field,text:f.text}));
  const links=[...new Set([...html.matchAll(/(?:href|src|data-src)="([^"]+)"/g)].map(m=>decode(m[1])))];
  const assets=links.filter(u=>/\/sites\/default\/files\//.test(u));
  const providers=links.filter(u=>/\/media\/oembed\?/.test(u)).map(u=>new URL(u,'https://www.tetiaroasociety.org').searchParams.get('url'));
  records.push({nid:profile.nid,language,url,sha256:createHash('sha256').update(html).digest('hex'),missingText,assets,providers});
}
await Promise.all(Array.from({length:10},async()=>{while(pending.length){const next=pending.shift();await audit(next);if(records.length%50===0)console.log(`Audited ${records.length} pages`);}}));
records.sort((a,b)=>a.nid-b.nid||a.language.localeCompare(b.language));
await fs.writeFile(`${cache}/atoll-live-audit.json`,JSON.stringify({auditedAt:new Date().toISOString(),pages:records.length,records},null,2));
console.log(`Audited ${records.length} live pages; ${records.filter(r=>r.missingText.length).length} have text differences requiring review.`);
