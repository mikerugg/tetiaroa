#!/usr/bin/env node
// Read-only verification of the published corpus and its referenced assets.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createClient} from '@sanity/client';
import {isLegacyAssetUrl,plain} from './migrate-atoll-guide.mjs';
if(process.argv.includes('--help')){console.log('Read-only Sanity corpus verification. Usage: node scripts/atoll-verify-migration.mjs [--check-assets]');process.exit(0);}
for(const filename of ['.env.local','.env'])try{for(const line of(await fs.readFile(filename,'utf8')).split('\n')){const m=line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].trim().replace(/^['"]|['"]$/g,'').replace(/\\n$/,'');}}catch{}
const client=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET,token:process.env.SANITY_API_TOKEN??process.env.SANITY_WRITE_TOKEN,apiVersion:'2026-07-02',useCdn:false});
const source=JSON.parse(await fs.readFile('.migration-cache/atoll-source.json','utf8'));
const documents=await client.fetch('*[_type in ["speciesGuide","atollCategory","atollHub"]]');
const profiles=documents.filter(d=>d._type==='speciesGuide');
const failures=[];
function check(condition,message){if(!condition)failures.push(message);}
const refs=new Set();
function walk(value,location){
  if(Array.isArray(value)){const keys=value.map(item=>item?._key).filter(Boolean);check(new Set(keys).size===keys.length,`${location}: duplicate array keys`);value.forEach((v,i)=>walk(v,`${location}[${i}]`));}
  else if(value&&typeof value==='object'){if(value._ref)refs.add(value._ref);for(const [key,child]of Object.entries(value))if(!['sourceSnapshot','migrationFieldHashes'].includes(key))walk(child,`${location}.${key}`);}
}
check(profiles.length===150,`Expected150 profiles, found${profiles.length}`);
for(const [category,count]of Object.entries(source.inventory.counts))check(profiles.filter(p=>p.category===category).length===count,`${category}: incorrect count`);
for(const profile of profiles){
  check(Boolean(profile.migrationFieldHashes),`${profile._id}: missing ownership hash`);
  check(Boolean(profile.scientificName),`${profile._id}: missing scientific name`);
  check(Boolean(profile.sourceSnapshot),`${profile._id}: missing source snapshot`);
  for(const locale of ['english','french']){
    const content=profile[locale];check(Boolean(content?.title&&content.summary&&content.body?.length&&content.gallery?.length),`${profile._id}.${locale}: incomplete content`);
    check(![...JSON.stringify(content).matchAll(/https?:[^\s"<>]+|\/sites\/default\/files\/[^\s"<>]+/g)].some(match=>isLegacyAssetUrl(match[0])),`${profile._id}.${locale}: legacy asset dependency`);
    for(const resource of content?.resources??[])if(resource.kind==='video')check(Boolean(resource.pageUrl),`${profile._id}.${locale}: video lacks public watch-page link`);
  }
  if(profile.category==='plants')check(profile.habitats.length===1&&profile.habitats[0]==='motu-shore',`${profile._id}: plant has a marine habitat`);
  walk(profile,profile._id);
}
check(documents.filter(d=>d._type==='atollCategory').length===6,'Expected six categories');
const hub=documents.find(d=>d._id==='atoll-hub');check(Boolean(hub),'Missing hub');
if(hub){walk(hub,hub._id);for(const locale of ['english','french'])for(const habitat of hub[locale]?.habitats??[])check(habitat.featuredEntries?.length===3,`${locale} ${habitat.id}: expected three curated examples`);}
for(const document of documents.filter(d=>d._type==='atollCategory'))walk(document,document._id);
const replacements=await client.fetch('*[_type=="impactEntry" && defined(guideReplacement)]{_id,guideReplacement}');
check(replacements.length===300,`Expected300 retained Impact source pointers, found${replacements.length}`);
const drafts=await client.withConfig({perspective:'raw'}).fetch('*[_id in ["drafts.species-drupal-76","drafts.species-drupal-338"]]._id');
check(drafts.length===2,'Expected both unpublished drafts');
check(!profiles.some(p=>[76,338].includes(p.sourceNodeId)),'Incomplete source became public');
const stories=await client.fetch('*[_id in $ids]{_id,body,language,atollRestorationVersion}',{ids:[...source.biosphere,...source.relatedStories].flatMap(s=>Object.values(s.locales).map(l=>l.existingSanity._id))});
check(stories.length===52,'Expected52 authored story translations');
for(const story of stories){check(story.body?.length>0,`${story._id}: empty related story`);check(story.atollRestorationVersion===2,`${story._id}: incomplete paragraph restoration`);walk(story.body,`${story._id}.body`);}
const referenceDocuments=await client.fetch('*[_id in $ids]{_id,_type,url}',{ids:[...refs]});
const existingRefs=new Set(referenceDocuments.map(document=>document._id));
for(const ref of refs)check(existingRefs.has(ref),`Missing referenced document/asset: ${ref}`);
const assets=referenceDocuments.filter(document=>['sanity.imageAsset','sanity.fileAsset'].includes(document._type));
let checkedAssetUrls=0;
if(process.argv.includes('--check-assets'))for(let index=0;index<assets.length;index+=12)await Promise.all(assets.slice(index,index+12).map(async asset=>{
  try{const response=await fetch(asset.url,{method:'HEAD',signal:AbortSignal.timeout(15000)});check(response.ok,`${asset._id}: CDN returned${response.status}`);checkedAssetUrls++;}
  catch(error){check(false,`${asset._id}: CDN check failed: ${error.message}`);}
}));
const normalizeText=value=>plain(value).normalize('NFC').replace(/\s+/g,' ').trim();
for(const original of [...source.biosphere,...source.relatedStories])for(const [language,locale]of Object.entries(original.locales)){
  const story=stories.find(story=>story._id===locale.existingSanity._id);if(!story)continue;
  const bodyText=normalizeText(story.body.flatMap(block=>(block.children??[]).map(child=>child.text??'')).join(' '));
  for(const paragraph of locale.paragraphs.filter(paragraph=>paragraph.text)){let video;try{video=JSON.parse(plain(paragraph.text)).video_url}catch{}if(video){check(story.body.some(block=>block._type==='videoEmbed'&&block.url===video),`${story._id}: missing video from paragraph${paragraph.paragraphId}`);continue;}const text=normalizeText(paragraph.text);if(text.length>20)check(bodyText.includes(text),`${story._id}: missing ${language} paragraph${paragraph.paragraphId} ${paragraph.field}`);}
}
const report={verifiedAt:new Date().toISOString(),publishedProfiles:profiles.length,translations:profiles.length*2,categories:6,hub:1,unpublishedDrafts:drafts.length,retainedImpactSources:replacements.length,restoredStories:stories.length,referencedDocumentsAndAssets:refs.size,assetDocuments:assets.length,checkedAssetUrls,failures};
await fs.writeFile('.migration-cache/atoll-verification-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
assert.equal(failures.length,0,'Migration verification failed; see .migration-cache/atoll-verification-report.json');
