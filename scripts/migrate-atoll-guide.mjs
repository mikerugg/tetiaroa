#!/usr/bin/env node
/**
 * Additive, repeatable migration into the dedicated Atoll Guide.
 * Default: build a local inventory only. --write publishes complete bilingual
 * rewrites with createIfNotExists; it never replaces an editor's guide document.
 * --restore-stories additionally restores omitted Drupal paragraph blocks, using
 * the saved Impact body and the current revision as concurrency guards.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createClient} from '@sanity/client';

export const decodeHtml=s=>String(s??'').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&#039;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)));
export const plain=s=>decodeHtml(String(s??'').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
const key=(...parts)=>createHash('sha1').update(parts.join(':')).digest('hex').slice(0,16);
const block=(text,style='normal',id='')=>({_type:'block',_key:key(id,style,text),style,markDefs:[],children:[{_type:'span',_key:'text',text,marks:[]}]});
export function rewriteToBlocks(rewrite,nid,language) {
  return (rewrite.sections??[]).flatMap((section,i)=>[
    ...(section.heading?[block(section.heading,'h2',`${nid}-${language}-${i}`)]:[]),
    ...(section.paragraphs??[]).map((text,j)=>block(text,'normal',`${nid}-${language}-${i}-${j}`)),
  ]);
}
export function normalizeSubgroup(value) {
  const text=plain(value).toLowerCase();
  if(text.includes('shore')||text.includes('terrestrial'))return 'shore-birds';
  if(text.includes('sea birds'))return 'seabirds';
  if(text.includes('bony'))return 'bony-fish';
  if(text.includes('shark'))return 'sharks';
  if(text.includes('ray'))return 'rays';
  if(text.includes('crust'))return 'crustaceans';
  if(text.includes('moll'))return 'molluscs';
  if(text.includes('coral')||text.includes('anemone')||text.includes('anthazoa'))return 'corals-anemones';
  if(text.includes('echino'))return 'echinoderms';
  if(text.includes('worm'))return 'worms';
  return undefined;
}
export function inferHabitats(profile) {
  if(profile.category==='plants')return ['motu-shore'];
  const locale=profile.locales.en;
  const text=(locale?.htmlFields?locale.htmlFields.filter(f=>['body','field_body2','field_body3','field_ecosystem_on_tetiaroa'].includes(f.field)).map(f=>f.text).join(' '):locale?.plainText??'').toLowerCase();
  const habitats=[];
  const habitatAction='(?:found|find|live|inhabit|frequent|habitat|occup|occur|shelter|forag|feed|hunt|seen|encounter|swim|graze|food|nest|roam|hide|graz)';
  const supports=(place)=>new RegExp(`${habitatAction}[^.!?]{0,170}(?:${place})|(?:${place})[^.!?]{0,110}${habitatAction}`).test(text);
  if(profile.category==='birds'||supports('forest|terrestrial|beach|motu|coast|shore'))habitats.push('motu-shore');
  if(supports('lagoon|reef|coral|intertidal'))habitats.push('lagoon-reef');
  if(profile.category==='marine-mammals'||supports('open ocean|open sea|pelagic|offshore|off-shore|oceanic'))habitats.push('open-ocean');
  return [...new Set(habitats)];
}
export const guideReferences=ids=>[...new Set(ids.filter(Boolean))].map(_ref=>({_type:'reference',_key:key(_ref),_ref}));
const attr=(html,name)=>decodeHtml(html.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`,'i'))?.[1]??'');
export const isLegacyAssetUrl=url=>{try{const parsed=new URL(url,'https://www.tetiaroasociety.org');return /^(?:www\.)?tetiaroasociety\.org$/.test(parsed.hostname)&&parsed.pathname.includes('/sites/default/files/');}catch{return false}};
const isFileUrl=u=>/\.(?:pdf|mp3|wav|ogg|m4a|mp4)(?:$|[?#])/i.test(u);
function canonical(value) {
  if(Array.isArray(value))return value.map(canonical);
  if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().filter(k=>value[k]!==undefined).map(k=>[k,canonical(value[k])]));
  return value;
}
export const fieldHash=value=>createHash('sha256').update(JSON.stringify(canonical(value))??'undefined').digest('hex');
const ownedFields=['slug','category','subgroup','habitats','scientificName','relatedStories',...['english','french'].flatMap(language=>['title','summary','body','localNames','otherNames','occurrence','plantFacts','gallery','resources'].map(field=>`${language}.${field}`))];
const atPath=(object,field)=>field.split('.').reduce((value,key)=>value?.[key],object);
export function reviewedChanges(current,next,baseline) {
  const changes={},conflicts=[];
  let hashes={};try{hashes=JSON.parse(current.migrationFieldHashes??'{}')}catch{}
  for(const field of ownedFields){
    const actual=atPath(current,field),target=atPath(next,field);
    if(target===undefined)continue;
    const actualHash=fieldHash(actual),targetHash=fieldHash(target);
    const expected=hashes[field]??(baseline?fieldHash(atPath(baseline,field)):undefined);
    if(actualHash===targetHash){if(!expected||expected===actualHash)hashes[field]=targetHash;continue;}
    if(expected===actualHash){changes[field]=target;hashes[field]=targetHash;}
    else conflicts.push(field);
  }
  return {changes,conflicts,hashes};
}

export async function main() {
  const cache=path.resolve('.migration-cache');
  const args=new Set(process.argv.slice(2));
  const write=args.has('--write')&&!args.has('--dry-run');
  for(const name of ['.env.local','.env'])try{for(const line of(await fs.readFile(name,'utf8')).split('\n')){const m=line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].trim().replace(/^['"]|['"]$/g,'').replace(/\\n$/,'');}}catch{}
  const client=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET,token:process.env.SANITY_API_TOKEN??process.env.SANITY_WRITE_TOKEN,apiVersion:'2026-07-02',useCdn:false});
  const source=JSON.parse(await fs.readFile(path.join(cache,'atoll-source.json'),'utf8'));
  const tables=JSON.parse(await fs.readFile(path.join(cache,'atoll-drupal-tables.json'),'utf8'));
  const audit=JSON.parse(await fs.readFile(path.join(cache,'atoll-live-audit.json'),'utf8'));
  const oldImpact=JSON.parse(await fs.readFile(path.join(cache,'atoll-existing-impact.json'),'utf8'));
  const assetCache=JSON.parse(await fs.readFile(path.join(cache,'drupal-impact-assets.json'),'utf8').catch(()=>'{}'));
  let newAssets={};try{newAssets=JSON.parse(await fs.readFile(path.join(cache,'atoll-assets.json'),'utf8'));}catch{}
  const rewrites=new Map();
  const manuscriptArg=[...args].find(arg=>arg.startsWith('--manuscript='));
  const cachedManuscripts=(await fs.readdir(cache)).filter(f=>/^atoll-rewrites.*\.json$/.test(f)).map(f=>path.join(cache,f));
  const manuscriptFiles=manuscriptArg?[path.resolve(manuscriptArg.slice('--manuscript='.length))]:cachedManuscripts.length?cachedManuscripts:[path.resolve('scripts/data/atoll-guide-reviewed.json')];
  for(const filename of manuscriptFiles) {
    const contents=JSON.parse(await fs.readFile(filename,'utf8'));
    for(const item of Array.isArray(contents)?contents:contents.profiles??contents.rewrites??[]) {
      if(rewrites.has(item.nid))throw new Error(`Duplicate rewrite nid ${item.nid}`);
      rewrites.set(item.nid,item);
    }
  }
  try{const metadata=JSON.parse(await fs.readFile(path.join(cache,'atoll-metadata-review.json'),'utf8'));for(const item of Array.isArray(metadata)?metadata:metadata.profiles??[]){const rewrite=rewrites.get(item.nid);if(rewrite)for(const language of ['english','french'])if(item[language])rewrite[language]={...rewrite[language],...item[language]};}}catch(error){if(error.code!=='ENOENT')throw error;}
  const complete=p=>{const r=rewrites.get(p.nid);return r?.english?.sections?.length&&r?.french?.sections?.length};
  const categoriesArg=[...args].find(arg=>arg.startsWith('--categories='));
  const categoryFilter=categoriesArg?categoriesArg.slice('--categories='.length).split(','):null;
  const available=source.profiles.filter(p=>complete(p)&&(!categoryFilter||categoryFilter.includes(p.category)));
  if(write&&available.length!==150&&!args.has('--allow-partial'))throw new Error(`Only ${available.length}/150 bilingual rewrites are ready. No data was written. Use --allow-partial only for reviewed representative entries.`);
  const report={mode:write?'write':'dry-run',publicProfiles:source.profiles.length,rewritesReady:available.length,documentsCreated:0,existingDocumentsPreserved:0,documentsRefreshed:0,editorialConflicts:[],uploadedAssets:0,reusedAssets:0,missingAssets:[],storiesRestored:[],storiesWithEditorialChanges:[],sourceCoverage:[]};
  const files=new Map(tables.file_managed.map(f=>[f.fid,f]));
  const fileByUrl=u=>{if(!isLegacyAssetUrl(u))return undefined;try{const pathname=decodeURIComponent(new URL(u,'https://www.tetiaroasociety.org').pathname);let relative=pathname.replace(/^.*\/sites\/default\/files\//,'').replace(/^styles\/[^/]+\/public\//,'').replace(/\.(jpg|jpeg|png)\.webp$/i,'.$1');return [...files.values()].find(f=>f.uri===`public://${relative}`)??[...files.values()].find(f=>f.filename===path.basename(relative));}catch{return undefined}};
  const assetInflight=new Map();
  async function asset(file,kind) {
    if(!file)return null;
    const cacheKey=`${kind}:${file.fid}:${file.changed}`;
    const existing=newAssets[cacheKey]??assetCache[cacheKey];
    if(existing){report.reusedAssets++;return {_type:'reference',_ref:existing};}
    if(assetInflight.has(cacheKey))return assetInflight.get(cacheKey);
    const promise=(async()=>{
      let local=path.join('.tetiaroa_old/files_live',file.uri.replace(/^public:\/\//,''));
      try{await fs.access(local);}catch{
        const directory=path.dirname(local),basename=path.basename(local);
        const normalize=s=>s.normalize('NFC').replace(/[?:]/g,'_');
        const candidates=await fs.readdir(directory).catch(()=>[]);
        const match=candidates.find(name=>normalize(name)===normalize(basename));
        if(match)local=path.join(directory,match);else{report.missingAssets.push({fid:file.fid,uri:file.uri});return null;}
      }
      if(!write){return {_type:'reference',_ref:`pending-${kind}-${file.fid}`};}
      const uploaded=await client.assets.upload(kind,createReadStream(local),{filename:file.filename,contentType:file.filemime});
      newAssets[cacheKey]=uploaded._id;report.uploadedAssets++;
      await fs.writeFile(path.join(cache,'atoll-assets.json'),JSON.stringify(newAssets,null,2));
      return {_type:'reference',_ref:uploaded._id};
    })();assetInflight.set(cacheKey,promise);return promise;
  }
  const getField=(locale,name)=>plain((locale?.fields[name]??[]).map(r=>Object.entries(r).find(([k])=>k.endsWith('_value'))?.[1]??'').join('\n'));
  const storyByNid=new Map([...source.biosphere,...(source.relatedStories??[])].map(s=>[s.nid,s]));
  const legacyMap=new Map();
  for(const p of source.profiles)for(const [lang,aliases]of Object.entries(p.aliases))for(const alias of aliases)legacyMap.set(`${lang==='fr'?'/fr':''}${alias}`,`${lang==='fr'?'/fr':''}/island/${p.category}/${p.slug}`);
  for(const s of oldImpact){const lang=s.language??'en';if(s.legacyPath&&s.slug?.current)legacyMap.set(`${lang==='fr'?'/fr':''}${s.legacyPath}`,`${lang==='fr'?'/fr':''}/impact/${s.slug.current}`);}
  async function rewriteUrl(raw) {
    const url=decodeHtml(raw);if(!url)return '';
    if(url.includes('/media/oembed?'))return rewriteUrl(new URL(url,'https://www.tetiaroasociety.org').searchParams.get('url')??url);
    if(isLegacyAssetUrl(url)){const f=fileByUrl(url);const ref=await asset(f,f?.filemime?.startsWith('image/')?'image':'file');if(!ref)return '';if(ref._ref.startsWith('pending-'))return url;const type=ref._ref.startsWith('image-')?'images':'files';const suffix=ref._ref.replace(/^(?:image|file)-/,'').replace(/-([^-]+)$/,'.$1');return `https://cdn.sanity.io/${type}/${client.config().projectId}/${client.config().dataset}/${suffix}`;}
    let parsed;try{parsed=new URL(url,'https://www.tetiaroasociety.org');}catch{return url;}
    return legacyMap.get(parsed.pathname)??(parsed.hostname.endsWith('tetiaroasociety.org')&&parsed.pathname.startsWith('/node/')?`https://www.tetiaroasociety.org${parsed.pathname}`:url);
  }
  const videoCache=new Map();
  async function videoUrl(provider){
    if(videoCache.has(provider))return videoCache.get(provider);
    const promise=(async()=>{if(!provider?.includes('.vids.io/'))return provider;const html=await(await fetch(provider)).text();return decodeHtml(html.match(/<iframe[^>]+src=['"]([^'"]+)/i)?.[1]??provider)})();videoCache.set(provider,promise);return promise;
  }
  async function gallery(locale,overrides=[]) {
    const images=[];
    for(const name of ['field_images','field_image','field_image2','field_image3','field_header_image'])for(const row of locale?.fields[name]??[]){
      const file=files.get(row[`${name}_target_id`]);if(!file?.filemime?.startsWith('image/'))continue;
      const ref=await asset(file,'image');if(!ref)continue;
      const title=row[`${name}_title`]??'';
      const credit=/photo|©|Ⓒ|copyright|crédit/i.test(title)?title:'';
      const override=overrides.find(o=>o.fileId===file.fid)??{};
      images.push({_key:key('image',file.fid),_type:'guidePhotograph',image:{_type:'image',asset:ref},alt:override.alt??(row[`${name}_alt`]||locale.title),caption:override.caption??(credit?'':title),credit:override.credit??credit,license:override.license??title.match(/CC\s+BY(?:-[A-Z]+)*/i)?.[0]});
    }
    if(!images.length&&locale?.existingSanity?.heroImage?.asset)images.push({_key:'hero',_type:'guidePhotograph',image:locale.existingSanity.heroImage,alt:locale.title});
    return images.filter((image,index)=>images.findIndex(i=>i.image.asset._ref===image.image.asset._ref)===index);
  }
  async function resources(profile,language) {
    const locale=profile.locales[language];
    const list=[];
    const add=(item)=>{if(item.url&&!list.some(r=>r.url===item.url))list.push({_type:'guideResource',_key:key(item.url),...item})};
    for(const field of locale?.htmlFields??[])for(const match of field.html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
      const raw=decodeHtml(match[1]);if(raw.startsWith('#')||/mailto:|tel:/.test(raw))continue;
      const url=await rewriteUrl(raw);const file=fileByUrl(raw);const ref=file&&isFileUrl(raw)?await asset(file,'file'):null;
      add({title:plain(match[2])||file?.filename||'Source',url,kind:isFileUrl(raw)?(/\.(mp3|ogg|wav|m4a)/i.test(raw)?'audio':'document'):'source',...(ref?{file:{_type:'file',asset:ref}}:{})});
    }
    let live=audit.records.find(r=>r.nid===profile.nid&&r.language===language);
    if(!live&&profile.category&&!profile.slug){const html=await fs.readFile(path.join(cache,`atoll-live-${profile.category}.html`),'utf8');live={assets:[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>decodeHtml(m[1])),providers:[]};}
    for(const url of live?.assets.filter(isFileUrl)??[]){
      const file=fileByUrl(url),ref=await asset(file,'file');if(!ref)continue;
      const audio=/\.(mp3|ogg|wav|m4a)/i.test(url);
      const title=audio?`${language==='fr'?'Écouter':'Listen'} — ${locale.title}${list.some(r=>r.kind==='audio')?' (2)':''}`:file.filename.replace(/[-_]/g,' ');
      add({title,url:await rewriteUrl(url),kind:audio?'audio':'document',file:{_type:'file',asset:ref}});
    }
    for(const provider of live?.providers??[])add({title:locale.title,url:await videoUrl(provider),pageUrl:provider,kind:'video'});
    const rewrite=rewrites.get(profile.nid);
    for(const item of rewrite?.verifiedSources??[])add({...item,kind:'source'});
    for(const note of rewrite?.editorialNotes??[])for(const match of note.matchAll(/https?:\/\/[^\s<>]+/g)){
      const url=match[0].replace(/[),.;]+$/,'');
      let host;try{host=new URL(url).hostname.replace(/^www\./,'');}catch{continue;}
      add({title:`${language==='fr'?'Référence':'Reference'} — ${host}`,url,kind:'source'});
    }
    return list;
  }
  async function bibliography(locale,nid,language) {
    const text=getField(locale,'field_source');if(!text)return [];
    const heading=language==='fr'?'Sources et crédits':'Sources and credits';
    return [block(heading,'h2',`${nid}-${language}-sources`),...await htmlToBlocks((locale.fields.field_source??[]).map(r=>r.field_source_value??'').join('\n'),`${nid}-${language}-bibliography`)];
  }
  async function htmlToBlocks(html,id) {
    try{const embedded=JSON.parse(plain(html));if(embedded.video_url)return [{_type:'videoEmbed',_key:key(id,'video'),url:await videoUrl(embedded.video_url)}];}catch{}
    const result=[];let count=0;
    const normalized=html.replace(/<script\b[\s\S]*?<\/script>/gi,'').replace(/<style\b[\s\S]*?<\/style>/gi,'').replace(/<iframe\b[\s\S]*?<\/iframe>/gi,'').replace(/<br\s*\/?\s*>/gi,'\n').replace(/<\/t[dh]>/gi,'; ').replace(/<\/tr>/gi,'\n');
    const chunks=normalized.split(/(<(?:p|h[1-6]|li|blockquote)\b[^>]*>[\s\S]*?<\/(?:p|h[1-6]|li|blockquote)>)/gi);
    for(const chunk of chunks){
      if(!plain(chunk))continue;
      const style=/^<h[12]\b/i.test(chunk)?'h2':/^<h[3-6]\b/i.test(chunk)?'h3':/^<blockquote/i.test(chunk)?'blockquote':'normal';
      const children=[],markDefs=[];let marks=[];
      for(const token of chunk.split(/(<[^>]+>)/g)){
        if(/^<(?:em|i)(?:\s|>)/i.test(token)){marks.push('em');continue;}
        if(/^<(?:strong|b)(?:\s|>)/i.test(token)){marks.push('strong');continue;}
        if(/^<\/(?:em|i)>/i.test(token)){marks=marks.filter(m=>m!=='em');continue;}
        if(/^<\/(?:strong|b)>/i.test(token)){marks=marks.filter(m=>m!=='strong');continue;}
        if(/^<a\s/i.test(token)){const href=await rewriteUrl(attr(token,'href'));if(href){const _key=key(id,count,markDefs.length);markDefs.push({_type:'link',_key,href});marks.push(_key);}continue;}
        if(/^<\/a>/i.test(token)){marks=marks.filter(m=>['em','strong'].includes(m));continue;}
        if(token.startsWith('<'))continue;
        const text=decodeHtml(token).replace(/[\t\r ]+/g,' ');if(text)children.push({_type:'span',_key:`s${children.length}`,text,marks:[...marks]});
      }
      if(children.some(c=>c.text.trim()))result.push({_type:'block',_key:key(id,count++),style,...(/^<li\b/i.test(chunk)?{listItem:'bullet',level:1}:{}),markDefs,children});
    }
    return result;
  }
  async function htmlMedia(html,id,language) {
    const result=[];
    for(const match of html.matchAll(/<img\b[^>]*>|<drupal-media\b[^>]*>|<iframe\b[^>]*>/gi)){
      const tag=match[0];
      if(tag.startsWith('<iframe')){const url=await videoUrl(await rewriteUrl(attr(tag,'src')));if(url)result.push({_type:'videoEmbed',_key:key(id,url),url});continue;}
      let file,caption=attr(tag,'data-caption')||attr(tag,'title'),alt=attr(tag,'alt');
      if(tag.startsWith('<img'))file=fileByUrl(attr(tag,'src'));
      else {
        const media=tables.media.find(m=>m.uuid===attr(tag,'data-entity-uuid'));
        if(!media)continue;
        const imageRows=tables.media__field_media_image.filter(r=>r.entity_id===media.mid);
        const image=imageRows.find(r=>r.langcode===language)??imageRows[0];
        if(image){file=files.get(image.field_media_image_target_id);alt=alt||image.field_media_image_alt;caption=caption||image.field_media_image_title;}
        else for(const table of ['media__field_media_oembed_sprout','media__field_media_oembed_video','media__field_media_oembed_youtube_vimeo']){
          const row=tables[table]?.find(r=>r.entity_id===media.mid);if(!row)continue;
          const provider=Object.entries(row).find(([k])=>k.endsWith('_value'))?.[1];
          if(provider)result.push({_type:'videoEmbed',_key:key(id,provider),url:await videoUrl(provider)});
        }
      }
      if(file){const ref=await asset(file,'image');if(ref)result.push({_type:'image',_key:key(id,file.fid),asset:ref,alt:alt||file.filename,caption});}
    }
    return result;
  }
  const documents=[];
  for(const profile of available) {
    const rewrite=rewrites.get(profile.nid);
    const locales={};
    for(const [lang,field]of [['en','english'],['fr','french']]){
      const original=profile.locales[lang],copy=rewrite[field];
      const plantFacts=profile.category==='plants'?{family:getField(original,'field_family'),biogeographicalStatus:getField(original,'field_biogeographical_status'),lifeForm:getField(original,'field_habit'),abundance:getField(original,'field_abundance_on_tetiaroa'),ecosystem:getField(original,'field_ecosystem_on_tetiaroa'),...(copy.plantFacts??{})}:undefined;
      const originalScientific=getField(profile.locales.en,'field_scientific_name');
      const scientificKey=value=>value.normalize('NFKC').toLowerCase().replace(/\s[×x]\s/g,' x ').replace(/\s+/g,' ').trim();
      const legacyScientific=rewrite.scientificName&&scientificKey(rewrite.scientificName)!==scientificKey(originalScientific)?`${lang==='fr'?'Nom de l’ancienne source':'Legacy source name'}: ${originalScientific}`:'';
      const otherNames=[copy.otherNames,legacyScientific].filter(Boolean).join('; ');
      locales[field]={_type:'guideProfileLocale',title:copy.title||original.title,summary:copy.summary,body:[...rewriteToBlocks(copy,profile.nid,lang),...await bibliography(original,profile.nid,lang)],localNames:copy.localNames??(getField(original,'field_other_names')||getField(profile.locales.en,'field_other_names')),otherNames,occurrence:copy.occurrence??'',...(plantFacts?{plantFacts:{_type:'plantFacts',...plantFacts}}:{}),gallery:await gallery(original,copy.galleryOverrides),resources:await resources(profile,lang)};
    }
    const legacyAliases=[];
    for(const [lang,aliases]of Object.entries(profile.aliases))for(const alias of aliases){legacyAliases.push({_key:key(lang,alias),path:alias,locale:lang});if(lang==='fr')legacyAliases.push({_key:key('fr-prefixed',alias),path:`/fr${alias}`,locale:lang});}
    for(const lang of ['en','fr']){const previous=profile.locales[lang].existingSanity;if(previous?.slug?.current)legacyAliases.push({_key:key('impact',lang,previous.slug.current),path:`${lang==='fr'?'/fr':''}/impact/${previous.slug.current}`,locale:lang});}
    const relatedIds=[...new Set(Object.values(profile.locales).flatMap(l=>(l.fields.field_biosphere_page??[]).map(r=>r.field_biosphere_page_target_id)))];
    const relatedStories=guideReferences(relatedIds.flatMap(nid=>Object.values(storyByNid.get(nid)?.locales??{}).map(locale=>locale.existingSanity?._id)));
    const scientificName=rewrite.scientificName??getField(profile.locales.en,'field_scientific_name');
    const record={_id:`species-drupal-${profile.nid}`,_type:'speciesGuide',slug:{_type:'slug',current:profile.slug},category:profile.category,subgroup:normalizeSubgroup(profile.subgroup),habitats:rewrite.habitats??inferHabitats(profile),scientificName,...locales,legacyAliases,legacyPaths:[...new Set(legacyAliases.map(a=>a.path))],legacyImpactIds:[...new Set(Object.values(profile.locales).map(l=>l.existingSanity?._id).filter(Boolean))],relatedStories,sourceNodeId:profile.nid,sourceCoverage:rewrite.sourceCoverage??[],editorialNotes:rewrite.editorialNotes??[],sourceSnapshot:JSON.stringify({source:profile.alias,backup:source.sqlFile,checkedAt:audit.auditedAt,originals:Object.fromEntries(Object.entries(profile.locales).map(([l,s])=>[l,{title:s.title,fields:s.fields}])),liveChecksums:audit.records.filter(r=>r.nid===profile.nid).map(r=>({language:r.language,sha256:r.sha256})),coverage:rewrite.sourceCoverage,editorialNotes:rewrite.editorialNotes}),reviewedAt:new Date().toISOString()};
    record.migrationFieldHashes=JSON.stringify(Object.fromEntries(ownedFields.map(field=>[field,fieldHash(atPath(record,field))])));
    documents.push(record);report.sourceCoverage.push({nid:profile.nid,englishBlocks:locales.english.body.length,frenchBlocks:locales.french.body.length,galleryImages:locales.english.gallery.length,resources:locales.english.resources.length,coverage:rewrite.sourceCoverage??[]});
  }
  if(write&&report.missingAssets.length)throw new Error(`Missing ${report.missingAssets.length} assets; no guide documents written. See local backup files.`);
  if(args.has('--seed')) {
    const {categoryDefaults,hubDefaults,getAtollPath}=await import('../lib/atoll/config.ts');
    const {atollCopy}=await import('../app/atoll/atoll-copy.ts');
    async function experienceImage(filename){const cacheKey=`local-image:${filename}`;let ref=newAssets[cacheKey];if(!ref&&write){const uploaded=await client.assets.upload('image',createReadStream(path.join('public',filename)),{filename:path.basename(filename)});ref=uploaded._id;newAssets[cacheKey]=ref;report.uploadedAssets++;await fs.writeFile(path.join(cache,'atoll-assets.json'),JSON.stringify(newAssets,null,2));}return {_type:'image',asset:{_type:'reference',_ref:ref??`pending-image-${key(filename)}`},alt:''};}
    const experienceImages={geology:await experienceImage('geology/atoll-foundation-poster.webp'),swac:await experienceImage('swac/key-project-03.gif')};
    for(const sourceCategory of source.categories){
      const category=sourceCategory.category;
      const photoProfile=source.profiles.find(p=>p.category===category);
      const photo=(await gallery(photoProfile.locales.en))[0];
      const localized={};
      for(const [language,field]of [['en','english'],['fr','french']]){const defaults=categoryDefaults[language].find(c=>c.id===category);localized[field]={title:defaults.title,introduction:defaults.introduction,subgroups:defaults.subgroups.map(s=>({_key:s.id,...s})),resources:await resources(sourceCategory,language)};}
      const stories=[...new Set(source.profiles.filter(p=>p.category===category).flatMap(p=>(p.locales.en.fields.field_biosphere_page??[]).map(r=>r.field_biosphere_page_target_id)))].flatMap(nid=>Object.values(storyByNid.get(nid)?.locales??{}).map(locale=>locale.existingSanity?._id)).filter(Boolean);
      documents.push({_id:`atoll-category-${category}`,_type:'atollCategory',category,...localized,image:photo?{...photo.image,alt:photo.alt,credit:photo.credit}:undefined,relatedStories:guideReferences(stories)});
    }
    const localized={};
    const habitatExamples={'motu-shore':91,'lagoon-reef':340,'open-ocean':107};
    const habitatEntries={'motu-shore':[91,41,74],'lagoon-reef':[114,340,379],'open-ocean':[107,249,250]};
    for(const [language,field]of [['en','english'],['fr','french']]){
      const defaults=hubDefaults[language],copy=atollCopy[language];localized[field]={title:defaults.title,introduction:defaults.introduction,habitats:[],experiences:['geology','swac'].map(experience=>({_key:experience,title:copy[`${experience}Title`],description:copy[`${experience}Description`],href:getAtollPath(language,experience),linkLabel:copy[`${experience}Link`],image:experienceImages[experience]}))};
      for(const habitat of defaults.habitats){const p=source.profiles.find(p=>p.nid===habitatExamples[habitat.id])??source.profiles.find(p=>inferHabitats(p).includes(habitat.id));const photo=(await gallery(p.locales[language]))[0];localized[field].habitats.push({_key:habitat.id,id:habitat.id,title:habitat.title,introduction:habitat.introduction,featuredEntries:habitatEntries[habitat.id].map(nid=>({_type:'reference',_key:String(nid),_ref:`species-drupal-${nid}`})),...(photo?{image:{...photo.image,alt:photo.alt,credit:photo.credit}}:{})});}
    }
    const heroAsset=await asset(files.get(2435),'image');
    documents.push({_id:'atoll-hub',_type:'atollHub',...localized,...(heroAsset?{image:{_type:'image',asset:heroAsset,alt:'Aerial view of Tetiaroa’s motu, lagoon, reef and ocean'}}:{}),featuredEntries:available.filter(p=>[188,74,91,41,107,340].includes(p.nid)).map(p=>({_type:'reference',_key:String(p.nid),_ref:`species-drupal-${p.nid}`})),relatedStories:guideReferences(source.biosphere.slice(0,6).flatMap(s=>Object.values(s.locales).map(locale=>locale.existingSanity?._id)))});
  }
  if(args.has('--include-drafts'))for(const draft of source.drafts.filter(d=>[76,338].includes(d.nid))){
    const english=draft.locales.en;
    const alias=tables.path_alias.find(a=>a.path===`/node/${draft.nid}`&&a.langcode==='en')?.alias;
    documents.push({_id:`drafts.species-drupal-${draft.nid}`,_type:'speciesGuide',slug:{_type:'slug',current:alias?.split('/').at(-1)??`legacy-${draft.nid}`},category:'invertebrates',scientificName:getField(english,'field_scientific_name'),english:{_type:'guideProfileLocale',title:english.title,summary:'',body:await htmlToBlocks(english.htmlFields.filter(f=>f.field==='body').map(f=>f.html).join('\n'),`draft-${draft.nid}`),localNames:getField(english,'field_other_names'),gallery:await gallery(english)},sourceNodeId:draft.nid,sourceSnapshot:JSON.stringify(draft),editorialNotes:['Not linked from the public legacy category. Incomplete source; retained as an unpublished draft.']});
  }
  await fs.writeFile(path.join(cache,'atoll-documents.json'),JSON.stringify(documents,null,2));
  if(write)for(let i=0;i<documents.length;i+=25){const chunk=documents.slice(i,i+25);const existing=await client.fetch('*[_id in $ids]._id',{ids:chunk.map(d=>d._id)});const tx=client.transaction();for(const doc of chunk)tx.createIfNotExists(doc);await tx.commit();report.documentsCreated+=chunk.length-existing.length;report.existingDocumentsPreserved+=existing.length;}
  if(args.has('--refresh-generated')) {
    let baselines=[];try{baselines=JSON.parse(await fs.readFile(path.join(cache,'atoll-owned-baselines.json'),'utf8'))}catch{}
    const refreshDocuments=documents.filter(d=>d._type==='speciesGuide'&&!d._id.startsWith('drafts.'));
    const currentDocuments=new Map((await client.fetch('*[_id in $ids]',{ids:refreshDocuments.map(d=>d._id)})).map(d=>[d._id,d]));
    const refreshPatches=[];
    for(const doc of refreshDocuments){
      const current=currentDocuments.get(doc._id);if(!current)continue;
      const {changes,conflicts,hashes}=reviewedChanges(current,doc,baselines.find(b=>b._id===doc._id));
      if(conflicts.length)report.editorialConflicts.push({id:doc._id,fields:conflicts});
      if(Object.keys(changes).length)report.documentsRefreshed++;
      const metadataChanged=fieldHash(current.sourceCoverage)!==fieldHash(doc.sourceCoverage)||fieldHash(current.editorialNotes)!==fieldHash(doc.editorialNotes);
      if(write&&(Object.keys(changes).length||metadataChanged||current.migrationFieldHashes!==JSON.stringify(hashes)))refreshPatches.push({id:current._id,revision:current._rev,changes:{...changes,migrationFieldHashes:JSON.stringify(hashes),sourceCoverage:doc.sourceCoverage,editorialNotes:doc.editorialNotes,...(Object.keys(changes).length||metadataChanged?{reviewedAt:doc.reviewedAt}:{})}});
    }
    for(let i=0;i<refreshPatches.length;i+=25){const transaction=client.transaction();for(const patch of refreshPatches.slice(i,i+25))transaction.patch(patch.id,p=>p.ifRevisionId(patch.revision).set(patch.changes));await transaction.commit();}
    for(const doc of documents.filter(d=>['atollHub','atollCategory'].includes(d._type))){
      const current=await client.getDocument(doc._id);if(!current)continue;
      const baseline=baselines.find(b=>b._id===doc._id);const changes={};
      for(const field of ['english','french','image','featuredEntries','relatedStories']){
        if(doc[field]===undefined||fieldHash(current[field])===fieldHash(doc[field]))continue;
        if(baseline&&fieldHash(current[field])===fieldHash(baseline[field]))changes[field]=doc[field];
        else report.editorialConflicts.push({id:doc._id,fields:[field]});
      }
      if(Object.keys(changes).length){report.documentsRefreshed++;if(write)await client.patch(current._id).ifRevisionId(current._rev).set(changes).commit();}
    }
    if(write)await fs.writeFile(path.join(cache,'atoll-owned-baselines.json'),JSON.stringify(documents,null,2));
  }
  if(write&&args.has('--append-verified-sources'))for(const doc of documents.filter(d=>d._type==='speciesGuide'&&!d._id.startsWith('drafts.'))){
    const current=await client.getDocument(doc._id);const changes={};
    for(const field of ['english','french']){const resources=current[field]?.resources??[];const missing=doc[field].resources.filter(r=>r.kind==='source'&&!resources.some(existing=>existing.url===r.url));if(missing.length)changes[`${field}.resources`]=[...resources,...missing];}
    if(Object.keys(changes).length)await client.patch(current._id).ifRevisionId(current._rev).set(changes).commit();
  }
  if(write&&args.has('--mark-replacements')){
    const replacements=[...source.profiles.map(profile=>({id:`species-drupal-${profile.nid}`,nid:profile.nid})),...source.categories.map(category=>({id:`atoll-category-${category.category}`,nid:category.nid})),{id:'atoll-hub',nid:190}];
    for(const item of replacements){
      const replacement=await client.getDocument(item.id);if(!replacement?.english?.title||!replacement?.french?.title)continue;
      const ids=replacement.legacyImpactIds??oldImpact.filter(d=>d.legacyNodeId===item.nid).map(d=>d._id);
      for(const id of ids){const original=await client.getDocument(id);if(original&&!original.guideReplacement)await client.patch(id).ifRevisionId(original._rev).set({guideReplacement:{_type:'reference',_ref:replacement._id}}).commit();}
    }
  }
  if(args.has('--restore-stories'))for(const story of [...source.biosphere,...(source.relatedStories??[])])for(const language of ['en','fr']){
    const locale=story.locales[language];if(!locale)continue;
    const baseline=oldImpact.find(d=>d._id===locale.existingSanity?._id);if(!baseline)continue;
    const current=write?await client.getDocument(baseline._id):baseline;
    if(current.atollRestorationVersion===2)continue;
    if(fieldHash(current.body)!==fieldHash(baseline.body)){report.storiesWithEditorialChanges.push({nid:story.nid,language});continue;}
    const body=[...(current.body??[])];
    const existingText=body.filter(b=>b._type==='block').flatMap(b=>b.children??[]).map(s=>s.text).join(' ').replace(/\s+/g,' ');
    for(const original of locale.htmlFields.filter(f=>['body','field_intro','field_body2','field_body3','field_sprout_video','field_sprout_vid','field_sproutvideo'].includes(f.field))){
      if(original.text&&!existingText.includes(original.text))body.push(...await htmlToBlocks(original.html,`${story.nid}-${language}-${original.field}`));
      for(const media of await htmlMedia(original.html,`${story.nid}-${language}-${original.field}`,language))if(!body.some(b=>b.asset?._ref&&b.asset._ref===media.asset?._ref||b.url&&b.url===media.url))body.push(media);
    }
    for(const p of locale.paragraphs??[]){
      if(p.imageFileId){const file=files.get(p.imageFileId);const ref=await asset(file,'image');if(ref&&!body.some(b=>b.asset?._ref===ref._ref))body.push({_type:'image',_key:key(story.nid,language,p.paragraphId,'image'),asset:ref,alt:Object.entries(p.row).find(([k])=>k.endsWith('_alt'))?.[1]??locale.title});}
      else if(p.html&&p.text&&!existingText.includes(p.text))body.push(...await htmlToBlocks(p.html,`${story.nid}-${language}-${p.paragraphId}-${p.field}`));
      if(p.html)for(const media of await htmlMedia(p.html,`${story.nid}-${language}-${p.paragraphId}-${p.field}`,language))if(!body.some(b=>b.asset?._ref&&b.asset._ref===media.asset?._ref||b.url&&b.url===media.url))body.push(media);
    }
    if(write)await client.patch(current._id).ifRevisionId(current._rev).set({body,atollRestorationVersion:2}).commit();
    report.storiesRestored.push({nid:story.nid,id:baseline._id,language,blocks:body.length});
  }
  if(args.has('--restore-audio'))for(const story of [...source.biosphere,...(source.relatedStories??[])])for(const language of ['en','fr']){
    const locale=story.locales[language],id=locale?.existingSanity?._id;if(!id)continue;
    const current=await client.getDocument(id);if(!current)continue;
    const profileIds=source.profiles.filter(p=>(p.locales.en.fields.field_biosphere_page??[]).some(r=>r.field_biosphere_page_target_id===story.nid)).map(p=>p.nid);
    const body=structuredClone(current.body??[]);
    let changed=false;
    for(let i=0;i<body.length;i++){const text=body[i].children?.map(s=>s.text).join('');try{const data=JSON.parse(text);if(data.video_url){body[i]={_key:body[i]._key,_type:'videoEmbed',url:await videoUrl(data.video_url)};changed=true;}}catch{}}
    const audioFiles=[...(locale.fields.field_audio_track??[]).map(r=>files.get(r.field_audio_track_target_id)),...audit.records.filter(r=>profileIds.includes(r.nid)).flatMap(r=>r.assets.filter(u=>/\.(mp3|wav|ogg|m4a)(?:$|[?#])/i.test(u)).map(fileByUrl))].filter(Boolean);
    for(const file of audioFiles){const ref=await asset(file,'file');if(ref&&!body.some(b=>b.file?.asset?._ref===ref._ref)){body.push({_type:'documentLink',_key:key(id,language,'audio',file.fid),title:`${language==='fr'?'Écouter':'Listen'} — ${locale.title}`,file:{_type:'file',asset:ref},url:await rewriteUrl(`/sites/default/files/${file.uri.replace(/^public:\/\//,'')}`)});changed=true;}}
    if(write&&changed)await client.patch(id).ifRevisionId(current._rev).set({body}).commit();
  }
  await fs.writeFile(path.join(cache,'atoll-migration-report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({...report,sourceCoverage:`${report.sourceCoverage.length} profiles; see .migration-cache/atoll-migration-report.json`},null,2));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await main();
