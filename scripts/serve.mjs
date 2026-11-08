/** Local preview only. Does not implement production hosting or TLS. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const arg=process.argv[2]||'dist';if(!['preview','dist'].includes(arg))throw new Error('Usare preview o dist');
const root=path.resolve(arg),port=Number(process.env.PORT||4173);
const types={'.js':'text/javascript; charset=utf-8','.mp3':'audio/mpeg','.bin':'application/octet-stream','.html':'text/html; charset=utf-8','.pdf':'application/pdf','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.xml':'application/xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
http.createServer({maxHeaderSize:8192,requestTimeout:15000,headersTimeout:10000},(req,res)=>{
 try{if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});return res.end('Pagina non trovata');}
 const real=fs.realpathSync(file),base=fs.realpathSync(root);if(!real.startsWith(base+path.sep)){res.writeHead(403);return res.end();}
 const ext=path.extname(real),body=fs.readFileSync(real);
 const headers={'Content-Type':types[ext]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY','Cache-Control':'no-store'};
 if(ext==='.html'){const csp=body.toString().match(/http-equiv="Content-Security-Policy" content="([^"]+)"/);if(csp)headers['Content-Security-Policy']=csp[1].replaceAll('&#39;',"'").replaceAll('&amp;','&')+"; frame-ancestors 'none'";}
 res.writeHead(200,headers);res.end(req.method==='HEAD'?undefined:body);
 }catch{res.writeHead(400);res.end('Richiesta non valida');}
}).listen(port,'127.0.0.1',()=>console.log(`Anteprima locale http://127.0.0.1:${port} (${arg})`));
