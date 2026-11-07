import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import {loadContent} from '../src/content.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');

test('biografia e ricerca non sono copie manuali divergenti dalle fonti JSON',()=>{
 const p=spawnSync(process.execPath,['scripts/sync-editorial.mjs','--check'],{cwd:root,encoding:'utf8'});
 assert.equal(p.status,0,p.stderr);
});
test('il primo articolo è una bozza reale non pubblicata e senza testo inventato',()=>{
 const p=JSON.parse(fs.readFileSync(path.join(root,'content/posts/colpire-i-nervi-del-sistema.json'),'utf8'));
 assert.equal(p.id,'colpire-i-nervi-del-sistema');
 assert.equal(p.sourceStatus,'awaiting-file');
 assert.equal(p.draft,true);
 assert.match(p.body,/__MDC_IN_ATTESA_SOURCE__/);
 assert.equal(loadContent(root).posts.length,0);
});
test('la guida futura chiarisce i materiali ancora mancanti',()=>{
 const t=fs.readFileSync(path.join(root,'docs/RIPRESA_E_MANUTENZIONE.md'),'utf8');
 for(const s of ['Colpire i nervi del sistema','Teacher Training','Alessandra Martin','quattro foto','CV','GitHub','Pages CMS']) assert.ok(t.includes(s),s);
});
