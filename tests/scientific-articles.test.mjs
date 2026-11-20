import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {loadContent} from '../src/content.mjs';
import {searchEntries} from '../src/search.mjs';
import {articleReading} from '../src/paths.mjs';
import {scientificArticle,equilibriumId} from '../src/scientific-articles.mjs';
const root=new URL('../',import.meta.url).pathname;

test('Equilibrium essay retains all 44 figures, 12 chapters, equations and glossary',()=>{
 const data=loadContent(root),post=data.posts.find(p=>p.id===equilibriumId);
 assert.ok(post&&!post.draft);
 const {body,toc}=articleReading(post,data);
 assert.equal((body.match(/class="science-figure"/g)||[]).length,44);
 assert.equal((toc.match(/<a /g)||[]).length,12);
 assert.ok((body.match(/<math /g)||[]).length>80);
 assert.equal((body.match(/<dt id="glossario-\d+" tabindex="-1">/g)||[]).length,17);
 assert.equal((body.match(/class="science-svg"/g)||[]).length,44);
 assert.doesNotMatch(body,/<img|<span class="math (?:display|inline)"|Per chi ama le formule|Il percorso parte|Nel confronto proposto qui|ricalcolati nella revisione/);
 assert.match(body,/Controllo con retroazione/);assert.match(body,/Piccolo glossario/);assert.match(body,/Horak/);
 const ids=[...body.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size);
 for(const m of (body+toc).matchAll(/href="(?:articolo-lequilibrio-sul-tappetino\.html)?#([^"]+)"/g))assert.ok(ids.includes(m[1]),'Missing reference '+m[1]);
 assert.doesNotMatch(body,/EQUILIBRIUMFIGURE|EQUILIBRIUMBOX|rigenera_grafici|<script|\sstyle=/);
});

test('Scientific diagrams remain local, passive vectors with preserved descriptions',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'src/scientific-articles',equilibriumId+'.json')));
 assert.equal(manifest.length,44);
 for(const figure of manifest){
  assert.ok(figure.alt.length>30);
  const svg=fs.readFileSync(path.join(root,'public/assets/articles/equilibrio',figure.file),'utf8');
  assert.match(svg,/<svg /);assert.match(svg,/<path /);if(![26,32].includes(figure.number))assert.match(svg,/<text /);
  assert.doesNotMatch(svg,/<(?:script|image|foreignObject)|(?:href="(?!#))|\son\w+=/);
 }
});

test('English essay localises text and figures while preserving cross-language anchors',()=>{
 const italian=loadContent(root),english=loadContent(root,{language:'en'});
 const itPost=italian.posts.find(p=>p.id===equilibriumId);
 const enPost=english.posts.find(p=>p.id===equilibriumId);
 assert.equal(enPost.title,'Balance on the Mat');
 assert.ok(!enPost.translationMissing);
 const it=articleReading(itPost,italian),en=articleReading(enPost,english);
 const collectIds=body=>[...body.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(collectIds(en.body),collectIds(it.body));
 assert.match(scientificArticle(enPost,'en'),/lang="en"/);
 assert.match(en.toc,/Making corrections/);
 assert.match(en.body,/<summary>Feedback control<\/summary>/);
 assert.match(en.body,/<text\b[^>]*>Inverted body<\/text>/);
 assert.match(en.body,/<title id="eq-27-title">The feedback loop that sustains Śīrṣāsana\.<\/title>/);
 assert.equal((en.body.match(/class="science-svg"/g)||[]).length,44);
 assert.equal((en.body.match(/<math /g)||[]).length,(it.body.match(/<math /g)||[]).length);
 assert.doesNotMatch(en.body,/Ingrandisci|DIAGRAMMA|<span class="math (?:display|inline)"/);
});

test('search points to the actual bilingual chapter and glossary anchors',()=>{
 for(const language of ['it','en']){
  const data=loadContent(root,{language});
  const article=data.posts.find(p=>p.id===equilibriumId);
  const {body}=articleReading(article,data);
  const rows=searchEntries(data).filter(r=>r.url.startsWith('articolo-'+equilibriumId+'.html#'));
  assert.equal(rows.length,29);
  assert.ok(rows.some(r=>r.keywords?.includes('LaSalle')));
  assert.ok(rows.some(r=>r.title===(language==='en'?'Centre of mass':'Centro di massa')));
  for(const row of rows)assert.ok(body.includes('id="'+row.url.split('#')[1]+'"'));
 }
});
