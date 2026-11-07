import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {loadContent} from '../src/content.mjs';
import {renderPages} from '../src/render.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/ARTICOLO_PRIMO_BLOG_MANIFEST.json')));
test('Original Overleaf archive and PDF have recorded checksums',()=>{
  assert.equal(sha(fs.readFileSync(path.join(root,'source-materials/Colpire_i_nervi_del_sistema_Overleaf.zip'))),manifest.archive_sha256);
  assert.equal(sha(fs.readFileSync(path.join(root,'public/media/docs/colpire-i-nervi-del-sistema.pdf'))),manifest.pdf_sha256);
});
test('Article figures are present with exactly the approved bytes',()=>{
  const article=loadContent(root).posts[0];
  for(let i=1;i<=7;i++){
    const file=`colpire-nervi-fig-${String(i).padStart(2,'0')}.png`;
    assert.equal(sha(fs.readFileSync(path.join(root,'public/media/images',file))),manifest.figure_sha256[file]);
    assert.ok(article.body.includes('/media/images/'+file));
  }
});
test('Published article page includes PDF button, bibliography and seven diagrams',()=>{
  const pages=new Map(renderPages(loadContent(root)).map(p=>[p.file,p.body]));
  const page=pages.get('articolo-colpire-i-nervi-del-sistema.html');
  assert.ok(page && page.includes('colpire-i-nervi-del-sistema.pdf'));
  assert.ok(page.includes('Riferimenti bibliografici'));
  assert.equal((page.match(/colpire-nervi-fig-/g)||[]).length,7);
});
