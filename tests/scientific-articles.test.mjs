import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {loadContent} from '../src/content.mjs';
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
 assert.equal((body.match(/<dt>/g)||[]).length,17);
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

test('English route uses the existing explicit original-language fallback',()=>{
 const data=loadContent(root,{language:'en'}),post=data.posts.find(p=>p.id===equilibriumId);
 assert.equal(post.translationMissing,true);
 assert.match(scientificArticle(post,'en'),/lang="it"/);
 assert.equal((articleReading(post,data).body.match(/class="science-figure"/g)||[]).length,44);
 assert.ok(articleReading(post,data).minutes>20);
});
