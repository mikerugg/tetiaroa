#!/usr/bin/env node
// Resolve nested Drupal paragraphs, retaining authored Biosphere stories.
import fs from 'node:fs/promises';
const cache='.migration-cache';
const source=JSON.parse(await fs.readFile(`${cache}/atoll-source.json`,'utf8'));
const tables=JSON.parse(await fs.readFile(`${cache}/atoll-drupal-tables.json`,'utf8'));
const paragraphs=JSON.parse(await fs.readFile(`${cache}/atoll-paragraph-tables.json`,'utf8'));
const sanity=JSON.parse(await fs.readFile(`${cache}/atoll-existing-impact.json`,'utf8'));
const strip=s=>String(s??'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
function walk(id,language,visited=new Set()) {
  if(visited.has(id))return [];
  visited.add(id);
  const result=[];
  for(const [table,rows]of Object.entries(paragraphs)) {
    if(!table.startsWith('paragraph__'))continue;
    const all=rows.filter(r=>r.entity_id===id&&!r.deleted);
    const selected=all.some(r=>r.langcode===language)?all.filter(r=>r.langcode===language):all.filter(r=>r.langcode==='en');
    for(const row of selected.sort((a,b)=>a.delta-b.delta)) {
      const value=Object.entries(row).find(([k,v])=>k.endsWith('_value')&&typeof v==='string'&&/<[a-z]/i.test(v));
      if(value)result.push({paragraphId:id,field:table,html:value[1],text:strip(value[1]),sourceLanguage:row.langcode});
      const image=Object.entries(row).find(([k])=>/(?:image|image_field)_target_id$/.test(k));
      if(image)result.push({paragraphId:id,field:table,imageFileId:image[1],row,sourceLanguage:row.langcode});
      for(const [key,target]of Object.entries(row))if(/(?:paragraphs|column_content(?:_[23w])?|accordion_section(?:_body)?|slide_content|tab_section(?:_body)?|modal_body)_target_id$/.test(key))result.push(...walk(target,language,visited));
    }
  }
  return result;
}
function enrich(entry){
  for(const language of ['en','fr']) {
    const locale=entry.locales[language];if(!locale)continue;
    let roots=locale.fields.field_paragraphs??entry.locales.en.fields.field_paragraphs??[];
    locale.paragraphs=roots.flatMap(r=>walk(r.field_paragraphs_target_id,language));
    locale.plainText=[...(locale.htmlFields??[]).map(f=>`${f.field}: ${f.text}`),...locale.paragraphs.filter(p=>p.text).map(p=>`${p.field}: ${p.text}`)].join('\n\n');
  }
}
for(const entry of [...source.profiles,...source.biosphere,...source.drafts])enrich(entry);
const relatedIds=[...new Set(source.profiles.flatMap(p=>Object.values(p.locales).flatMap(l=>(l?.fields.field_biosphere_page??[]).map(r=>r.field_biosphere_page_target_id))))];
source.relatedStories=relatedIds.filter(nid=>!source.biosphere.some(b=>b.nid===nid)).map(nid=>({nid,alias:tables.path_alias.find(a=>a.path===`/node/${nid}`&&a.langcode==='en')?.alias,locales:Object.fromEntries(['en','fr'].map(language=>{
  const row=tables.node_field_data.find(r=>r.nid===nid&&r.langcode===language);
  if(!row)return [language,null];
  const fields=Object.fromEntries(Object.entries(tables).filter(([n])=>n.startsWith('node__')).map(([name,rows])=>[name.replace('node__',''),rows.filter(r=>r.entity_id===nid&&r.langcode===language&&!r.deleted)]).filter(([,rows])=>rows.length));
  const htmlFields=Object.entries(fields).flatMap(([field,rows])=>rows.flatMap(r=>Object.entries(r).filter(([k,v])=>k.endsWith('_value')&&typeof v==='string').map(([,html])=>({field,html,text:strip(html)}))));
  const existing=sanity.find(s=>s.legacyNodeId===nid&&s.language===language)??sanity.find(s=>s.legacyNodeId===nid&&s[language==='fr'?'french':'english']);
  return [language,{title:row.title,fields,htmlFields,plainText:htmlFields.map(f=>f.text).join('\n\n'),existingSanity:existing?{_id:existing._id,...(existing.language===language?existing:existing[language==='fr'?'french':'english']??existing)}:null}];
}))}));
source.relatedStories.forEach(enrich);
source.inventory.nestedParagraphs=[...source.biosphere,...source.relatedStories].reduce((n,e)=>n+Object.values(e.locales).reduce((n,l)=>n+(l?.paragraphs.length??0),0),0);
await fs.writeFile(`${cache}/atoll-source.json`,JSON.stringify(source,null,2));
console.log(`Recovered ${source.inventory.nestedParagraphs} nested blocks in ${source.biosphere.length+source.relatedStories.length} authored stories.`);
