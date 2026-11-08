import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {validateSourceBoundary,validatePublicBoundary} from '../src/security.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),source=validateSourceBoundary(root),publicFiles=validatePublicBoundary(root);
const files=fs.readdirSync(path.join(root,'.github/workflows')).filter(n=>/\.ya?ml$/.test(n));
for(const name of files){const text=fs.readFileSync(path.join(root,'.github/workflows',name),'utf8');if(/pull_request_target:|workflow_run:|permissions:\s*write-all|persist-credentials:\s*true/.test(text))throw Error('Workflow da revisionare');for(const m of text.matchAll(/uses:\s*([^\s#]+)/g))if(!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_./-]+@[a-f0-9]{40}$/.test(m[1]))throw Error('Azione senza SHA completo');}
console.log(JSON.stringify({source,publicFiles,workflows:files.length,scope:'Build boundaries, not antivirus or penetration test.'},null,2));
