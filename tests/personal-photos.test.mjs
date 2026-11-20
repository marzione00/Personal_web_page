import test from 'node:test';
import assert from 'node:assert/strict';
import {loadContent} from '../src/content.mjs';
import {renderPages} from '../src/render.mjs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
test('personal photographs have unique safe destinations and accessible captions',()=>{
 const {profile}=loadContent(root);
 assert.equal(profile.personalPhotos.length,6);
 assert.equal(new Set(profile.personalPhotos.map(p=>p.file)).size,6);
 for(const p of profile.personalPhotos){assert.match(p.file,/^\/media\/images\/[a-z0-9-]+\.jpg$/);assert.ok(p.alt.length>40);assert.ok(p.caption.length>4);}
});
test('gallery does not render broken image links when source bytes are absent',()=>{
 const data=loadContent(root);
 const page=renderPages(data).find(p=>p.file==='cv.html').body;
 const img=(page.match(/class=\"personal-gallery-item/g)||[]).length;
 assert.equal(img,data.profile.availablePersonalPhotos.length);
});

test('preview presents every marked photo position without broken image URLs',()=>{
 const p=loadContent(root,{preview:true});
 const page=renderPages(p).find(x=>x.file==='cv.html').body;
 const unavailable=p.profile.personalPhotos.length-p.profile.availablePersonalPhotos.length;
 assert.equal((page.match(/class="personal-photo-pending"/g)||[]).length,unavailable);
 assert.equal((page.match(/class="personal-gallery-item/g)||[]).length,p.profile.personalPhotos.length);
});

test('the biography opens the two practice photos in one bilingual gallery',()=>{
 for(const language of ['it','en']){
  const data=loadContent(root,{language});
  const page=renderPages(data).find(p=>p.file==='cv.html').body;
  const gallery=page.match(/<div class="personal-gallery profile-practice-photos" data-travel-gallery>([\s\S]*?<\/figure><figure[\s\S]*?<\/figure>)<\/div>/)?.[1];
  assert.ok(gallery);
  assert.equal((gallery.match(/data-travel-photo/g)||[]).length,2);
  for(const id of ['yoga-equilibrio-laterale','yoga-estensione-studio']){
   const photo=data.profile.personalPhotos.find(photo=>photo.id===id);
   assert.equal((page.match(new RegExp('src="media/images/'+id+'.jpg"','g'))||[]).length,1);
   assert.ok(gallery.includes(photo.caption));
  }
  assert.match(gallery,/Vasiṣṭhāsana/);
  assert.match(page,/<figcaption>Bharadvājāsana · /);
  assert.match(page,/Parivṛtta Sūrya Yantrāsana/);
  assert.equal((page.match(/class="photo-guides"/g)||[]).length,2);
 }
});
