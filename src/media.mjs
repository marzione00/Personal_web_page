import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {inflateRawSync} from 'node:zlib';
import {safeMedia} from './safety.mjs';
// Exact reviewed original: the bytes "/JS:" occur inside a compressed stream,
// not in a PDF action. PyMuPDF object review: no active-action indicators, no
// embedded files. Any byte change invalidates this exception. See reports/pdf-structure-review.json.
const reviewedFalsePositives=new Set(['6e8195ac7d3489792b72cb64f7ed2aab12e58d10438f185367958e3a574a4dac']);
/** Basic format/size checks, not a malware scanner or a proof of document safety. */
export function validateMediaBuffer(filename,buf){
 const ext=path.extname(filename).toLowerCase();
 if(!buf.length || buf.length>25*1024*1024)throw new Error('File vuoto o oltre 25 MiB: '+filename);
 if(ext==='.pdf'){
  if(buf.subarray(0,5).toString()!=='%PDF-')throw new Error('Firma PDF non valida: '+filename);
  // An intentionally incomplete heuristic; encoded/compressed PDF objects require a real scanner.
  if(/\/(?:JavaScript|JS|Launch|EmbeddedFile|RichMedia)\b/.test(buf.toString('latin1'))&&!reviewedFalsePositives.has(createHash('sha256').update(buf).digest('hex')))throw new Error('PDF con indicatori attivi da revisionare: '+filename);
 }else if(ext==='.png'){
  if(!buf.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw new Error('Firma PNG non valida');
 }else if(['.jpg','.jpeg'].includes(ext)){
  if(!buf.subarray(0,3).equals(Buffer.from([255,216,255])))throw new Error('Firma JPEG non valida');
 }else if(ext==='.webp'){
  if(buf.toString('ascii',0,4)!=='RIFF'||buf.toString('ascii',8,12)!=='WEBP')throw new Error('Firma WEBP non valida');
 }else if(['.pptx','.docx'].includes(ext)){
  let end=-1;for(let i=buf.length-22;i>=Math.max(0,buf.length-65557);i--)if(buf.readUInt32LE(i)===0x06054b50){end=i;break;}
  if(end<0)throw new Error('Archivio Office non valido');
  const count=buf.readUInt16LE(end+10);let offset=buf.readUInt32LE(end+16),total=0,found=false;
  if(count>5000)throw new Error('Archivio Office troppo complesso');
  for(let n=0;n<count;n++){
   if(offset+46>buf.length||buf.readUInt32LE(offset)!==0x02014b50)throw new Error('Directory Office non valida');
   const flags=buf.readUInt16LE(offset+8),method=buf.readUInt16LE(offset+10),compressed=buf.readUInt32LE(offset+20),size=buf.readUInt32LE(offset+24),nameLen=buf.readUInt16LE(offset+28),extra=buf.readUInt16LE(offset+30),comment=buf.readUInt16LE(offset+32),local=buf.readUInt32LE(offset+42);
   const name=buf.toString('utf8',offset+46,offset+46+nameLen).toLowerCase();total+=size;
   if(total>150*1024*1024||size>25*1024*1024||flags&1)throw new Error('Archivio cifrato o troppo grande');
   if(name.includes('..')||name.startsWith('/')||name.includes('\\')||/vbaproject|activex\/|embeddings\/|\.exe$|\.js$|\.html?$/.test(name))throw new Error('Contenuto Office non consentito: '+name);
   if(name===(ext==='.pptx'?'ppt/presentation.xml':'word/document.xml'))found=true;
   if(name==='[content_types].xml'){
    if(local+30>buf.length||buf.readUInt32LE(local)!==0x04034b50)throw new Error('Header Office non valido');
    const start=local+30+buf.readUInt16LE(local+26)+buf.readUInt16LE(local+28),raw=buf.subarray(start,start+compressed);
    if(size>4*1024*1024)throw new Error('XML Office troppo grande');
    const xml=method===0?raw:method===8?inflateRawSync(raw,{maxOutputLength:4*1024*1024}):null;
    if(!xml||/macroenabled|vbaProject/i.test(xml.toString()))throw new Error('Macro Office non consentite');
   }
   offset+=46+nameLen+extra+comment;
  }
  if(!found)throw new Error('Estensione non coerente col contenuto Office');
 }else throw new Error('Estensione non consentita: '+ext);
 return true;
}
export function validateMedia(root){
 const folder=path.join(root,'public/media');let bytes=0,files=0;
 function walk(dir){for(const name of fs.readdirSync(dir)){const file=path.join(dir,name),stat=fs.lstatSync(file);if(stat.isSymbolicLink())throw new Error('Link simbolici non consentiti');if(stat.isDirectory()){walk(file);continue;}if(name==='.gitkeep')continue;const rel=path.relative(path.join(root,'public'),file).split(path.sep).join('/');if(!safeMedia(rel))throw new Error('Nome o tipo media non valido: '+rel);const buf=fs.readFileSync(file);validateMediaBuffer(file,buf);bytes+=buf.length;files++;}}
 walk(folder);if(bytes>512*1024*1024)throw new Error('Archivio media oltre il limite di progetto (512 MiB)');return{files,bytes};
}
