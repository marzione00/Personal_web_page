/** Focused integration audit, not a replacement for npm test / build:release / check. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadTeachingApps,renderTeachingApps,renderAppLaunchDialog} from '../src/teaching-apps.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const check=(ok,message)=>{if(!ok)throw Error(message);console.log('OK '+message);};
const render=read('src/render.mjs'),build=read('scripts/build.mjs');
check(!/function teachingApps\(|data-app-launch-overlay|data-launch-sequence/.test(render),'nessuna vecchia implementazione nel renderer');
check(!/data-app-launch-overlay/.test(read('src/app.js')),'nessun vecchio launcher in app.js');
check(!/\.linked-apps-section\s*\{/.test(read('src/site.css')),'nessun vecchio blocco CSS');
for(const marker of ['${renderTeachingApps(data)}','${renderAppLaunchDialog(data,page.body)}','...teachingAppSearchEntries(data),'])check(render.split(marker).length===2,'un solo punto: '+marker);
for(const marker of ["'teaching-apps.css'","'teaching-app-launch.js'",'d.teachingApps=loadTeachingApps(root,d.language);'])check(build.split(marker).length===2,'un solo punto build: '+marker);
for(const language of ['it','en']){
 const d={language,teachingApps:loadTeachingApps(root,language)};const html=renderTeachingApps(d);
 check(!html.includes('nuovo-laboratorio'),language+': modello non pubblicato');
 check(!html.includes('<iframe'),language+': nessun iframe');
 check(renderAppLaunchDialog(d,html).includes('<dialog'),language+': dialog disponibile');
}
const cv=path.join(root,'public/media/docs/CV_Marzio_De_Corato.pdf');
check(!fs.existsSync(cv)||!fs.readFileSync(cv).includes(Buffer.from('CV placeholder')),'nessun CV placeholder riconoscibile');
console.log('Audit mirato completato. Eseguire ancora i controlli completi del sito e il collaudo online.');
