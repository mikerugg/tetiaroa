#!/usr/bin/env node
/** Read-only route, canonical, alias and sitemap audit against a running site. */
import fs from 'node:fs/promises';
import {createClient} from '@sanity/client';

for (const name of ['.env.local', '.env']) {
  try { process.loadEnvFile(name); } catch {}
}
const base = process.argv.find(arg => arg.startsWith('--base='))?.slice(7) ?? 'http://localhost:3298';
const client = createClient({projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, apiVersion: '2026-07-02', useCdn: false, perspective: 'published'});
const [profiles, sources] = await Promise.all([
  client.fetch('*[_type == "speciesGuide"]{_id,category,"slug":slug.current,english{title},french{title},legacyAliases}'),
  client.fetch('*[_type == "impactEntry" && defined(guideReplacement->_id)]{english{slug},french{slug},"replacement":guideReplacement->{_type,category,"slug":slug.current}}'),
]);
const expected = {birds:16,plants:37,fish:56,turtles:5,'marine-mammals':9,invertebrates:27};
const report = {base, checkedAt:new Date().toISOString(), profiles:profiles.length, requests:0, redirects:0, failures:[]};
for (const [category, count] of Object.entries(expected)) {
  const actual = profiles.filter(profile => profile.category === category).length;
  if (actual !== count) report.failures.push({category,expected:count,actual});
}
const jobs = [];
const guideSections = ['', 'guide', ...Object.keys(expected)];
for (const locale of ['en', 'fr']) for (const section of guideSections) {
  const suffix = section ? `/${section}` : '';
  const path = `${locale === 'fr' ? '/fr' : ''}/island${suffix}`;
  jobs.push({path, canonical: path, alternate: `${locale === 'fr' ? '' : '/fr'}/island${suffix}`});
}
for (const locale of ['en', 'fr']) {
  const root = `${locale === 'fr' ? '/fr' : ''}/island`;
  jobs.push({path:`${root}/explore`,destination:root});
  jobs.push({path:`${root}?q=tern&category=birds&subgroup=seabirds&habitat=motu-shore&page=2&utm_source=old-link`,destination:`${root}/guide?q=tern&category=birds&subgroup=seabirds&habitat=motu-shore&page=2`});
  jobs.push({path:`${root}?utm_source=homepage`,canonical:root,alternate:`${locale === 'fr' ? '' : '/fr'}/island`});
}
const guidePath = (locale, record) => `${locale === 'fr' ? '/fr' : ''}/island${record._type === 'atollHub' ? '' : `/${record.category}${record._type === 'atollCategory' ? '' : `/${record.slug}`}`}`;
for (const profile of profiles) {
  for (const locale of ['en','fr']) {
    const path = guidePath(locale,profile);
    jobs.push({path,canonical:path,alternate:guidePath(locale === 'en' ? 'fr' : 'en',profile)});
    if (!(locale === 'fr' ? profile.french : profile.english)?.title) report.failures.push({path,error:'Missing localized title'});
  }
  for (const alias of profile.legacyAliases ?? []) {
    const destination = guidePath(alias.locale,profile);
    if (alias.path !== destination) jobs.push({path:alias.path,destination});
  }
}
for (const source of sources) for (const [locale,field] of [['en','english'],['fr','french']]) {
  if (source[field]?.slug?.current) jobs.push({path:`${locale === 'fr' ? '/fr' : ''}/impact/${source[field].slug.current}`,destination:guidePath(locale,source.replacement)});
}
for (const [path,destination] of [['/fr/ile','/fr/island'],['/fr/ile/oiseaux','/fr/island/birds'],['/fr/ile/plantes','/fr/island/plants'],['/fr/ile/poisson','/fr/island/fish'],['/fr/ile/tortues','/fr/island/turtles'],['/fr/ile/mammiferes-marins','/fr/island/marine-mammals'],['/fr/ile/invertebres','/fr/island/invertebrates']]) jobs.push({path,destination});
for (const path of ['/island/not-a-category','/island/birds/not-a-species','/fr/island/plants/not-a-species']) jobs.push({path,status:404});
const unique = [...new Map(jobs.map(job => [job.path,job])).values()];
let cursor = 0;
await Promise.all(Array.from({length:4}, async () => {
  while (cursor < unique.length) {
    const job = unique[cursor++];
    try {
      const response = await fetch(new URL(job.path,base),{redirect:'manual',signal:AbortSignal.timeout(90000)});
      report.requests++;
      if (job.destination) {
        const location = response.headers.get('location');
        const redirected = location ? new URL(location,base) : undefined;
        if (response.status !== 308 || !redirected || decodeURI(`${redirected.pathname}${redirected.search}`) !== decodeURI(job.destination)) report.failures.push({...job,status:response.status,location});
        else report.redirects++;
        await response.body?.cancel();
      } else {
        const html = await response.text();
        if (response.status !== (job.status ?? 200)) report.failures.push({...job,status:response.status});
        if (job.canonical) {
          const canonical = html.match(/<link rel="canonical" href="([^"]+)"/u)?.[1];
          const alternate = [...html.matchAll(/<link rel="alternate" hrefLang="[^"]+" href="([^"]+)"/gu)].map(match=>new URL(match[1]).pathname);
          if (!canonical || decodeURI(new URL(canonical).pathname) !== decodeURI(job.canonical)) report.failures.push({...job,error:'Wrong canonical',canonical});
          if (!alternate.some(path=>decodeURI(path) === decodeURI(job.alternate))) report.failures.push({...job,error:'Missing locale alternate'});
          if (/"_type":"plantFacts"<\/dd>|>_type<\/dt>/.test(html)) report.failures.push({...job,error:'CMS field leaked into visible facts'});
        }
      }
    } catch (error) { report.failures.push({...job,error:error.message}); }
    if (report.requests % 100 === 0) console.log(`Checked ${report.requests}/${unique.length} routes`);
  }
}));
const sitemap = await (await fetch(new URL('/sitemap.xml',base))).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>decodeURI(new URL(match[1]).pathname));
for (const path of ['/island/explore', '/fr/island/explore']) if (urls.includes(path)) report.failures.push({path,error:'Retired explore URL remains in sitemap'});
for (const locale of ['en', 'fr']) for (const section of guideSections) {
  const path = `${locale === 'fr' ? '/fr' : ''}/island${section ? `/${section}` : ''}`;
  if (!urls.includes(path)) report.failures.push({path, error:'Missing guide section from sitemap'});
}
for (const profile of profiles) for (const locale of ['en','fr']) if (!urls.includes(decodeURI(guidePath(locale,profile)))) report.failures.push({path:guidePath(locale,profile),error:'Missing from sitemap'});
for (const source of sources) for (const [locale,field] of [['en','english'],['fr','french']]) if (source[field]?.slug?.current) {
  const path = `${locale === 'fr' ? '/fr' : ''}/impact/${source[field].slug.current}`;
  if (urls.includes(decodeURI(path))) report.failures.push({path,error:'Superseded Impact URL remains in sitemap'});
}
await fs.mkdir('.migration-cache',{recursive:true});
await fs.writeFile('.migration-cache/atoll-route-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({profiles:report.profiles,requests:report.requests,redirects:report.redirects,failures:report.failures.length},null,2));
if (report.failures.length) { console.log(JSON.stringify(report.failures.slice(0,20),null,2));process.exitCode=1; }
