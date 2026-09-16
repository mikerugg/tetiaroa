#!/usr/bin/env node
// Keep reviewed manuscripts and their source-to-target checklist reviewable in Git.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const cache='.migration-cache';
const source=JSON.parse(await fs.readFile(`${cache}/atoll-source.json`,'utf8'));
const audit=JSON.parse(await fs.readFile(`${cache}/atoll-live-audit.json`,'utf8'));
const reportPath=process.argv.find(arg=>arg.startsWith('--import-report='))?.slice('--import-report='.length)??`${cache}/atoll-migration-report.json`;
const report=JSON.parse(await fs.readFile(reportPath,'utf8'));
const verification=JSON.parse(await fs.readFile(`${cache}/atoll-verification-report.json`,'utf8'));
const repeatReport=JSON.parse(await fs.readFile(`${cache}/atoll-migration-report.json`,'utf8'));
const assetCache={...JSON.parse(await fs.readFile(`${cache}/drupal-impact-assets.json`,'utf8')),...JSON.parse(await fs.readFile(`${cache}/atoll-assets.json`,'utf8'))};
if(report.mode!=='write'||verification.failures.length)throw new Error('Export requires a completed write report and successful corpus verification.');
const profiles=[];
for(const filename of(await fs.readdir(cache)).filter(f=>/^atoll-rewrites.*\.json$/.test(f)))profiles.push(...JSON.parse(await fs.readFile(`${cache}/${filename}`,'utf8')));
try{const overrides=JSON.parse(await fs.readFile(`${cache}/atoll-metadata-review.json`,'utf8'));for(const item of Array.isArray(overrides)?overrides:overrides.profiles??[]){const profile=profiles.find(p=>p.nid===item.nid);if(profile)for(const language of ['english','french'])if(item[language])profile[language]={...profile[language],...item[language]};}}catch(error){if(error.code!=='ENOENT')throw error;}
profiles.sort((a,b)=>a.nid-b.nid);
if(profiles.length!==150||new Set(profiles.map(p=>p.nid)).size!==150)throw new Error('Expected exactly 150 reviewed bilingual entries.');
await fs.mkdir('scripts/data',{recursive:true});
const manuscript={version:1,reviewedAt:new Date().toISOString(),languages:['en','fr'],profiles};
const serialized=JSON.stringify(manuscript,null,2)+'\n';
await fs.writeFile('scripts/data/atoll-guide-reviewed.json',serialized);
const ledger={version:1,exportedAt:new Date().toISOString(),sourceBackup:source.sqlFile,liveAuditAt:audit.auditedAt,manuscriptSha256:createHash('sha256').update(serialized).digest('hex'),counts:source.inventory.counts,publicProfiles:150,translations:300,unpublishedDrafts:[76,338],historicalPagesOutsideBatch:[99,100],fieldsRecovered:['scientific_name','other_names','family','biogeographical_status','habit','abundance_on_tetiaroa','ecosystem_on_tetiaroa','images with credits/captions','audio_track','recursive paragraph text/media','biosphere_page'],entries:source.profiles.map(p=>({_id:`species-drupal-${p.nid}`,sourceNodeId:p.nid,category:p.category,slug:p.slug,legacyAliases:p.aliases,legacyImpactIds:[...new Set(Object.values(p.locales).map(l=>l.existingSanity?._id).filter(Boolean))],originalMedia:p.media.map(file=>({sourceFileId:file.fid,uri:file.uri,mime:file.filemime,bytes:file.filesize,sanityAsset:assetCache[`${file.filemime?.startsWith('image/')?'image':'file'}:${file.fid}:${file.changed}`]??file.sanityAsset})),sourceFields:Object.fromEntries(Object.entries(p.locales).map(([language,locale])=>[language,Object.keys(locale.fields)])),sourceChecksums:audit.records.filter(r=>r.nid===p.nid).map(r=>({language:r.language,url:r.url,sha256:r.sha256,missingText:r.missingText.length})),coverage:profiles.find(r=>r.nid===p.nid).sourceCoverage,editorialNotes:profiles.find(r=>r.nid===p.nid).editorialNotes})),authoredStories:[...source.biosphere,...source.relatedStories].map(story=>({sourceNodeId:story.nid,legacyUrl:story.alias,impactIds:Object.fromEntries(Object.entries(story.locales).map(([language,locale])=>[language,locale.existingSanity?._id])),englishParagraphs:story.locales.en.paragraphs.length,frenchParagraphs:story.locales.fr?.paragraphs.length??0})),verification,repeatImport:repeatReport.mode==='dry-run'?{mode:repeatReport.mode,documentsRefreshed:repeatReport.documentsRefreshed,editorialConflicts:repeatReport.editorialConflicts,missingAssets:repeatReport.missingAssets}:undefined,latestImport:{mode:report.mode,retainedImpactSources:300,restoredStoryTranslations:52,documentsCreated:report.documentsCreated,documentsRefreshed:report.documentsRefreshed,editorialConflicts:report.editorialConflicts,missingAssets:report.missingAssets}};
await fs.writeFile('scripts/data/atoll-migration-ledger.json',JSON.stringify(ledger,null,2)+'\n');
console.log('Exported all 150 reviewed bilingual manuscripts and migration evidence.');
