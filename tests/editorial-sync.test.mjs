import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import {loadContent} from '../src/content.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');

test('Markdown è fonte autoritativa dei contenuti biografici e della ricerca',()=>{
 const data=loadContent(root);
 const md=fs.readFileSync(path.join(root,'content/markdown/profilo.md'),'utf8');
 assert.ok(md.includes(data.profile.personalInterests));
 const research=fs.readFileSync(path.join(root,'content/markdown/ricerca.md'),'utf8');
 assert.ok(research.includes(data.research.introduction));
});
test('il saggio Overleaf originale è pubblicato con tutti i riferimenti e le sette figure',()=>{
 const p=JSON.parse(fs.readFileSync(path.join(root,'content/posts/colpire-i-nervi-del-sistema.json'),'utf8'));
 assert.equal(p.id,'colpire-i-nervi-del-sistema');
 assert.equal(p.sourceStatus,'approved');
 assert.equal(p.draft,false);
 assert.doesNotMatch(p.body,/__MDC_IN_ATTESA_SOURCE__|MDCFIGURE/);
 assert.equal((p.body.match(/!\[Schema /g)||[]).length,7);
 assert.equal((p.body.match(/^- \*\*\[\d+\]\*\*/gm)||[]).length,19);
 assert.ok(p.body.length>28000);
 assert.ok(loadContent(root).posts.some(p=>p.id==='colpire-i-nervi-del-sistema'));
 assert.ok(fs.existsSync(path.join(root,'public/media/docs/colpire-i-nervi-del-sistema.pdf')));
});
test('la guida futura chiarisce i materiali ancora mancanti',()=>{
 const t=fs.readFileSync(path.join(root,'docs/RIPRESA_E_MANUTENZIONE.md'),'utf8');
 for(const s of ['Colpire i nervi del sistema','Teacher Training','Alessandra Martin','quattro foto','CV','GitHub','Pages CMS']) assert.ok(t.includes(s),s);
});
