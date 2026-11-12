import test from 'node:test';
import assert from 'node:assert/strict';
import {loadContent} from '../src/content.mjs';
import {localiseData} from '../src/i18n.mjs';
import {profileChapters,profilePage} from '../src/profile.mjs';
const root=new URL('../',import.meta.url).pathname;

test('reordering translated chapters preserves anchors and their media associations',()=>{
 const it=loadContent(root),en=localiseData(root,loadContent(root),'en');
 for(const key of ['biography','personalInterests']){
  assert.deepEqual(profileChapters(it.profile[key]).map(x=>x.id),profileChapters(en.profile[key]).map(x=>x.id));
 }
 const chapters=it.profile.biography.split(/(?=^### )/m).filter(x=>x.trim());
 it.profile.biography=chapters.reverse().join('');
 const html=profilePage(it);
 assert.match(html,/<section[^>]*id="fisica-geometria"[\s\S]*?data-geometry="schwarzite-neck"/);
 assert.equal((html.match(/id="didattica"/g)||[]).length,1);
 for(const name of ['Giada Merli','Alessandra Martin','Camilla Vigorelli']){
  const vinyasa=html.split('id="percorso-vinyasa"')[1].split('</section>')[0];
  assert.ok(vinyasa.includes(name));assert.ok(vinyasa.includes('studio'));
 }
});
test('each card has a unique anchor and an accessible title in both languages',()=>{
 for(const language of ['it','en']){
  const data=localiseData(root,loadContent(root),language),html=profilePage(data);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size);
  for(const m of html.matchAll(/aria-labelledby="([^"]+)"/g))assert.ok(ids.includes(m[1]));
  assert.equal((html.match(/class="profile-card /g)||[]).length,13);
  assert.doesNotMatch(html,/\{#[a-z-]+\}/);
  assert.match(html,/<p lang="grc">ποταμῷ/);
  assert.doesNotMatch(html,/profile-card-links|ricerca\.html#pub-/);
  assert.doesNotMatch(data.profile.biography,/https?:|ANNPR|Nano Letters|Applied Stochastic|\]\(/);
 }
});
test('quoted user text is escaped and duplicate chapter anchors are disambiguated',()=>{
 const data=loadContent(root);
 data.profile.personalInterests='### One {#example}\n\n> <script>alert(1)</script>\n> & second line\n\n### Two {#example}\n\nAnother paragraph.';
 const html=profilePage(data);
 assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>alert'));
 assert.equal((html.match(/id="example"/g)||[]).length,1);
 assert.equal((html.match(/id="example-2"/g)||[]).length,1);
});
