import test from 'node:test';
import assert from 'node:assert/strict';
import {decodeHtml, plain, rewriteToBlocks, normalizeSubgroup, inferHabitats,guideReferences,isLegacyAssetUrl,fieldHash,reviewedChanges} from './migrate-atoll-guide.mjs';

test('regional names and accented source names survive HTML decoding',()=>{
  assert.equal(plain('<p>‘Ōhiti&nbsp;(S), Kaveu &amp; &#039;Oio</p>'),"‘Ōhiti (S), Kaveu & 'Oio");
  assert.equal(decodeHtml('&#257;'), 'ā');
});
test('repeated section text still has distinct stable Portable Text keys',()=>{
  const copy={sections:[{heading:'Habitat',paragraphs:['Sur le récif.']},{heading:'Habitat',paragraphs:['Sur le récif.']}]};
  const blocks=rewriteToBlocks(copy,99,'fr');
  assert.equal(blocks.length,4);
  assert.equal(new Set(blocks.map(b=>b._key)).size,4);
  assert.deepEqual(blocks,rewriteToBlocks(copy,99,'fr'));
  assert.equal(blocks[1].children[0].text,'Sur le récif.');
});
test('legacy subdivisions map to the public guide taxonomy',()=>{
  assert.equal(normalizeSubgroup('Sea Birds'),'seabirds');
  assert.equal(normalizeSubgroup('Shore &amp; Terrestrial Birds'),'shore-birds');
  assert.equal(normalizeSubgroup('Anthazoa'),'corals-anemones');
  assert.equal(normalizeSubgroup('video header plants'),undefined);
});
test('habitat tags follow source habitat evidence',()=>{
  assert.deepEqual(inferHabitats({category:'invertebrates',locales:{en:{plainText:'Lives beneath fallen trunks in the forest.'}}}),['motu-shore']);
  assert.deepEqual(inferHabitats({category:'fish',locales:{en:{plainText:'Grazes the reef in shallow lagoon water.'}}}),['lagoon-reef']);
  assert.deepEqual(inferHabitats({category:'fish',locales:{en:{plainText:'A fish with a yellow stripe.'}}}),[]);
  assert.deepEqual(inferHabitats({category:'plants',locales:{en:{plainText:'Seeds cross the open ocean and its bark is used to catch fish in the lagoon.'}}}),['motu-shore']);
  assert.deepEqual(inferHabitats({category:'invertebrates',locales:{en:{htmlFields:[{field:'body',text:'Lives in the forest.'},{field:'field_source',text:'Coral reef ocean habitats volume 2'}]}}}),['motu-shore']);
});
test('reviewed updates retain human edits and update untouched generated fields',()=>{
  const baseline={english:{title:'Original title',summary:'Original intro',body:[{text:'Original body'}]}};
  const current={english:{title:'Editor title',summary:'Original intro',body:[{text:'Original body'}]}};
  const next={english:{title:'Reviewed title',summary:'Reviewed intro',body:[{text:'Reviewed body'}]}};
  const result=reviewedChanges(current,next,baseline);
  assert.deepEqual(result.conflicts,['english.title']);
  assert.equal(result.changes['english.title'],undefined);
  assert.equal(result.changes['english.summary'],'Reviewed intro');
  assert.deepEqual(result.changes['english.body'],[{text:'Reviewed body'}]);
});
test('stored field hashes support repeat imports without a local baseline',()=>{
  const current={english:{summary:'Original'},migrationFieldHashes:JSON.stringify({'english.summary':fieldHash('Original')})};
  const result=reviewedChanges(current,{english:{summary:'Reviewed'}});
  assert.equal(result.changes['english.summary'],'Reviewed');
  const second=reviewedChanges({english:{summary:'Reviewed'},migrationFieldHashes:JSON.stringify(result.hashes)},{english:{summary:'Reviewed'}});
  assert.deepEqual(second.changes,{});
  assert.equal(fieldHash({a:1,b:2}),fieldHash({b:2,a:1}));
});

test('only the legacy host has its Drupal files migrated',()=>{
  assert.equal(isLegacyAssetUrl('/sites/default/files/whale.mp3'),true);
  assert.equal(isLegacyAssetUrl('https://www.tetiaroasociety.org/sites/default/files/photo.jpg'),true);
  assert.equal(isLegacyAssetUrl('https://cites.org/sites/default/files/sharks.pdf'),false);
});

test('related reading keeps both translations without duplicate references',()=>{
  const refs=guideReferences(['impact-711-en','impact-711-fr','impact-711-en',undefined]);
  assert.deepEqual(refs.map(r=>r._ref),['impact-711-en','impact-711-fr']);
  assert.equal(new Set(refs.map(r=>r._key)).size,2);
});
