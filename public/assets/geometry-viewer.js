/* MDC_LAB geometry renderer — local, dependency-free, loaded only on interaction.
 * One WebGL context, one canvas, bounded CPU/GPU resources. No remote requests.
 */
(() => {
 'use strict';
 const VS=`attribute vec3 position;attribute vec3 normal;attribute vec3 color;
 uniform vec2 angles;uniform float size;uniform float aspect;
 varying vec3 vNormal;varying vec3 vColor;varying vec3 vPosition;varying vec2 vPlane;
 vec3 rotate(vec3 v){float a=angles.x,b=angles.y;v=vec3(cos(b)*v.x+sin(b)*v.z,v.y,-sin(b)*v.x+cos(b)*v.z);return vec3(v.x,cos(a)*v.y-sin(a)*v.z,sin(a)*v.y+cos(a)*v.z);}
 void main(){vec3 p=rotate(position);vPosition=p;vPlane=position.xz*1.3469388;vNormal=rotate(normal);vColor=color;gl_Position=vec4(p.x/(size*aspect),p.y/size,-p.z/8.0,1.0);}`;
 const FS=`precision highp float;varying vec3 vNormal;varying vec3 vColor;varying vec3 vPosition;varying vec2 vPlane;uniform float unlit;uniform float fractal;
 void main(){vec3 n=normalize(vNormal);if(!gl_FrontFacing)n=-n;vec3 L=normalize(vec3(-0.6,0.8,1.3));
 float diffuse=max(dot(n,L),0.0);float fill=max(dot(n,normalize(vec3(0.7,-0.1,0.5))),0.0);
 float rim=pow(1.0-abs(n.z),2.5);float spec=pow(max(dot(reflect(-L,n),vec3(0.,0.,1.)),0.),40.0);
 vec3 shaded=vColor*(0.28+0.68*diffuse+0.16*fill)+vec3(.68,.90,.81)*(0.13*rim+0.30*spec);
 vec3 outColor=mix(shaded,vColor,unlit);
 if(fractal>0.5){vec2 z=vPlane;float count=180.0;for(int i=0;i<180;i++){z=vec2(z.x*z.x-z.y*z.y,2.0*z.x*z.y)+vec2(-.74543,.11301);if(dot(z,z)>100.0){count=float(i)+1.0-log2(log2(length(z)));break;}}
 float ring=.5+.5*cos(count*.53);float b=min(1.0,count/25.0)*(.24+.76*ring);if(count>178.0)b=.09;outColor=mix(vec3(.025,.065,.05),vec3(.77,.94,.83),b);}
 gl_FragColor=vec4(outColor,1.0);}`;
 function decode(buffer){
  if(!(buffer instanceof ArrayBuffer)||buffer.byteLength<24||buffer.byteLength>1500000)throw Error('Modello non valido.');
  const d=new DataView(buffer);if(d.getUint32(0,true)!==0x3343444d)throw Error('Formato modello non riconosciuto.');
  const n=d.getUint32(4,true),ni=d.getUint32(8,true),flags=d.getUint32(12,true);
  if(n<3||n>60000||ni<3||ni%3||ni>180000)throw Error('Limiti del modello superati.');
  let posEnd=24+n*6,colEnd=posEnd+n*3,ixStart=colEnd+(colEnd%2);
  if(ixStart+ni*2!==buffer.byteLength)throw Error('Modello incompleto.');
  const p=new Float32Array(n*3),q=new Int16Array(buffer,24,n*3);for(let i=0;i<q.length;i++)p[i]=q[i]/4096;
  const ix=new Uint16Array(buffer,ixStart,ni),co=new Uint8Array(buffer,posEnd,n*3),norm=new Float32Array(n*3);let radius=0;
  for(let i=0;i<p.length;i+=3)radius=Math.max(radius,Math.hypot(p[i],p[i+1],p[i+2]));
  for(let i=0;i<ni;i+=3){const a=ix[i]*3,b=ix[i+1]*3,c=ix[i+2]*3;if(c>=p.length||a>=p.length||b>=p.length)throw Error('Indice non valido.');
   const u=[p[b]-p[a],p[b+1]-p[a+1],p[b+2]-p[a+2]],v=[p[c]-p[a],p[c+1]-p[a+1],p[c+2]-p[a+2]];
   const nn=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
   for(const j of [a,b,c])for(let k=0;k<3;k++)norm[j+k]+=nn[k];
  }
  for(let i=0;i<norm.length;i+=3){let l=Math.hypot(norm[i],norm[i+1],norm[i+2])||1;norm[i]/=l;norm[i+1]/=l;norm[i+2]/=l;}
  return{p,norm,ix,co,fractal:(flags&2)?1:0,unlit:flags&1,camera:[d.getFloat32(16,true),d.getFloat32(20,true)],radius};
 }
 class Viewer{
  constructor(){
   this.canvas=document.createElement('canvas');this.canvas.className='geometry-canvas';this.canvas.setAttribute('aria-hidden','true');
   const gl=this.gl=this.canvas.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:false,preserveDrawingBuffer:true,powerPreference:'low-power'});
   if(!gl)throw Error('Il 3D non è disponibile: rimangono visibili immagine, formula e spiegazione.');
   this.program=gl.createProgram();this.buffers=[];this.raf=0;this.angle=[.4,-.5];this.target=this.angle.slice();this.zoom=1;this.auto=false;this.frames=0;this.alive=true;
   for(const [kind,source] of [[gl.VERTEX_SHADER,VS],[gl.FRAGMENT_SHADER,FS]]){const s=gl.createShader(kind);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Shader non disponibile.');gl.attachShader(this.program,s);gl.deleteShader(s);}
   gl.linkProgram(this.program);if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw Error('Rendering non disponibile.');
   gl.useProgram(this.program);this.uniforms={};for(const key of ['angles','size','aspect','unlit','fractal'])this.uniforms[key]=gl.getUniformLocation(this.program,key);
   this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.alive=false;this.stop();this.canvas.remove();this.host?.classList.remove('is-live');this.onlost?.();});
   gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clearColor(0,0,0,0);
   this.resizeObserver=new ResizeObserver(()=>this.render());
  }
  attach(host){if(this.host){this.host.classList.remove('is-live');this.resizeObserver.unobserve(this.host);}this.host=host;host.append(this.canvas);host.classList.add('is-live');this.resizeObserver.observe(host);this.render();}
  load(buffer){
   const gl=this.gl;this.stop();const m=this.model=decode(buffer);this.angle=m.camera.slice();this.target=this.angle.slice();this.zoom=1;
   for(const b of this.buffers)gl.deleteBuffer(b);this.buffers=[];gl.useProgram(this.program);
   for(const [name,values,typ,normalized] of [['position',m.p,gl.FLOAT,false],['normal',m.norm,gl.FLOAT,false],['color',m.co,gl.UNSIGNED_BYTE,true]]){
    const b=gl.createBuffer();this.buffers.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,values,gl.STATIC_DRAW);const loc=gl.getAttribLocation(this.program,name);gl.vertexAttribPointer(loc,3,typ,normalized,0,0);gl.enableVertexAttribArray(loc);
   }
   const b=gl.createBuffer();this.buffers.push(b);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,b);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,m.ix,gl.STATIC_DRAW);this.render();
  }
  render(){
   if(!this.alive||!this.model||!this.host||document.hidden)return;
   const rect=this.host.getBoundingClientRect();if(rect.width<1||rect.height<1)return;
   const dpr=Math.min(window.devicePixelRatio||1,1.75),w=Math.max(1,Math.min(1400,Math.round(rect.width*dpr))),h=Math.max(1,Math.min(1100,Math.round(rect.height*dpr)));
   if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}
   const gl=this.gl;gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);gl.uniform2fv(this.uniforms.angles,this.angle);
   gl.uniform1f(this.uniforms.aspect,w/h);gl.uniform1f(this.uniforms.size,this.model.radius*1.05/this.zoom * Math.max(1,h/w));gl.uniform1f(this.uniforms.unlit,this.model.unlit);gl.uniform1f(this.uniforms.fractal,this.model.fractal);
   gl.drawElements(gl.TRIANGLES,this.model.ix.length,gl.UNSIGNED_SHORT,0);this.frames++;
  }
  move(pitch,yaw,smooth=true){this.target=[Math.max(-1.5,Math.min(1.5,pitch)),yaw];if(smooth)this.start();else{this.angle=this.target.slice();this.render();}}
  start(){if(this.raf||!this.alive)return;let previous=0;const tick=t=>{
    this.raf=0;if(document.hidden||!this.host||!this.alive)return;
    if(t-previous<32){this.raf=requestAnimationFrame(tick);return;}previous=t;
    if(this.auto)this.target[1]+=.008;
    let distance=0;for(let i=0;i<2;i++){const diff=this.target[i]-this.angle[i];distance+=Math.abs(diff);this.angle[i]+=diff*.18;}
    this.render();if(this.auto||distance>.001)this.raf=requestAnimationFrame(tick);
   };this.raf=requestAnimationFrame(tick);}
  stop(){cancelAnimationFrame(this.raf);this.raf=0;this.auto=false;}
  detach(){this.stop();this.canvas.remove();if(this.host){this.host.classList.remove('is-live');this.resizeObserver.unobserve(this.host);}this.host=null;}
  reset(){this.stop();if(!this.model)return;this.angle=this.model.camera.slice();this.target=this.angle.slice();this.zoom=1;this.render();}
  setZoom(z){this.zoom=Math.max(.65,Math.min(2.4,z));this.render();}
  dispose(){this.detach();this.resizeObserver.disconnect();const gl=this.gl;for(const b of this.buffers)gl.deleteBuffer(b);gl.deleteProgram(this.program);gl.getExtension('WEBGL_lose_context')?.loseContext();this.alive=false;}
 }
 window.MDCGeometry={Viewer,decode};
})();
