/* Shared local renderer for visible scientific previews and the interactive dialog.
 * Each instance uses WebGL or a bounded Canvas 2D projection. No remote requests.
 */
(() => {
 'use strict';
 const VS=`attribute vec3 position;attribute vec3 normal;attribute vec3 color;
 uniform vec2 angles;uniform float size;uniform float aspect;
 varying vec3 vNormal;varying vec3 vColor;varying vec3 vPosition;varying vec2 vPlane;
 vec3 rotate(vec3 v){float a=angles.x,b=angles.y;v=vec3(cos(b)*v.x+sin(b)*v.z,v.y,-sin(b)*v.x+cos(b)*v.z);return vec3(v.x,cos(a)*v.y-sin(a)*v.z,sin(a)*v.y+cos(a)*v.z);}
 void main(){vec3 p=rotate(position);vPosition=p;vPlane=position.xz*1.3469388;vNormal=rotate(normal);vColor=color;gl_Position=vec4(p.x/(size*aspect),p.y/size,-p.z/8.0,1.0);}`;
 const FS=`precision highp float;varying vec3 vNormal;varying vec3 vColor;varying vec3 vPosition;varying vec2 vPlane;uniform float unlit;uniform float fractal;uniform float displayMode;uniform vec3 lightDirection;uniform vec3 lightTint;
 void main(){vec3 n=normalize(vNormal);if(!gl_FrontFacing)n=-n;vec3 L=lightDirection;
 float diffuse=max(dot(n,L),0.0);float fill=max(dot(n,normalize(vec3(0.7,-0.1,0.5))),0.0);
 float rim=pow(1.0-abs(n.z),2.5);float spec=pow(max(dot(reflect(-L,n),vec3(0.,0.,1.)),0.),40.0);
 vec3 shaded=vColor*(vec3(0.28+0.16*fill)+lightTint*(0.68*diffuse))+vec3(.68,.90,.81)*lightTint*(0.13*rim+0.30*spec);
 vec3 outColor=mix(shaded,vColor,unlit);
 if(fractal>0.5){vec2 z=vPlane;float count=180.0;for(int i=0;i<180;i++){z=vec2(z.x*z.x-z.y*z.y,2.0*z.x*z.y)+vec2(-.74543,.11301);if(dot(z,z)>100.0){count=float(i)+1.0-log2(log2(length(z)));break;}}
 float ring=.5+.5*cos(count*.53);float b=min(1.0,count/25.0)*(.24+.76*ring);if(count>178.0)b=.09;outColor=mix(vec3(.025,.065,.05),vec3(.77,.94,.83),b);}
 if(displayMode>0.5&&displayMode<1.5){float contours=.5+.5*cos(vPosition.y*19.0);outColor=outColor*1.08+vec3(.18,.75,.47)*(rim*.40+pow(contours,18.0)*.10);}
 if(displayMode>1.5)outColor=mix(vec3(.12,.42,.28),vec3(.68,1.0,.84),.25+.75*rim);
 gl_FragColor=vec4(outColor,1.0);}`;
 function decode(buffer){
  if(!(buffer instanceof ArrayBuffer)||buffer.byteLength<24||buffer.byteLength>1500000)throw Error('Modello non valido.');
  const d=new DataView(buffer);if(d.getUint32(0,true)!==0x3343444d)throw Error('Formato modello non riconosciuto.');
  const n=d.getUint32(4,true),ni=d.getUint32(8,true),flags=d.getUint32(12,true);
  if(flags>3||![d.getFloat32(16,true),d.getFloat32(20,true)].every(x=>Number.isFinite(x)&&Math.abs(x)<=100))throw Error('Parametri modello non validi.');
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
  if(!Number.isFinite(radius)||radius<1e-6)throw Error('Modello degenere.');
  return{p,norm,ix,co,fractal:(flags&2)?1:0,unlit:flags&1,camera:[d.getFloat32(16,true),d.getFloat32(20,true)],radius};
 }
 function edgeIndices(ix){
  const seen=new Set(),edges=[];
  for(let i=0;i<ix.length;i+=3)for(const [a,b] of [[ix[i],ix[i+1]],[ix[i+1],ix[i+2]],[ix[i+2],ix[i]]]){
   const low=Math.min(a,b),high=Math.max(a,b),key=low*65536+high;
   if(low!==high&&!seen.has(key)){seen.add(key);edges.push(low,high);}
  }
  return new Uint16Array(edges);
 }
 function lightAt(phase){
  const direction=[-.6+.95*Math.sin(phase),.8+.28*Math.sin(phase*.7),1.3],length=Math.hypot(...direction);
  return {direction:direction.map(v=>v/length),tint:[.72+.13*Math.cos(phase),.96,.84+.14*Math.sin(phase*.8)]};
 }
 class Viewer{
  constructor({preview=false}={}){
   this.preview=preview;this.dynamicLight=false;this.lightPhase=0;this.previewCount=1;this.sway=false;this.swayYaw=.58;this.swayPitch=.09;this.motionTime=0;
   this.canvas=document.createElement('canvas');this.canvas.className='geometry-canvas';this.canvas.setAttribute('aria-hidden','true');
   const gl=this.gl=this.canvas.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:false,preserveDrawingBuffer:true,powerPreference:'low-power'});
   if(!gl){
    this.software=true;this.ctx=this.canvas.getContext('2d');if(!this.ctx)throw Error('Il 3D non è disponibile: rimangono visibili immagine, formula e spiegazione.');
    this.buffers=[];this.raf=0;this.angle=[.4,-.5];this.target=this.angle.slice();this.zoom=1;this.auto=false;this.mode='glow';this.frames=0;this.alive=true;this.drawCost=0;
    this.resizeObserver=new ResizeObserver(()=>this.render());return;
   }
   this.program=gl.createProgram();this.buffers=[];this.raf=0;this.angle=[.4,-.5];this.target=this.angle.slice();this.zoom=1;this.auto=false;this.mode='glow';this.frames=0;this.alive=true;
   for(const [kind,source] of [[gl.VERTEX_SHADER,VS],[gl.FRAGMENT_SHADER,FS]]){const s=gl.createShader(kind);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Shader non disponibile.');gl.attachShader(this.program,s);gl.deleteShader(s);}
   gl.linkProgram(this.program);if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw Error('Rendering non disponibile.');
   gl.useProgram(this.program);this.uniforms={};for(const key of ['angles','size','aspect','unlit','fractal','displayMode','lightDirection','lightTint'])this.uniforms[key]=gl.getUniformLocation(this.program,key);
   this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.alive=false;this.stop();this.canvas.remove();this.host?.classList.remove('is-live');this.onlost?.();});
   gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clearColor(0,0,0,0);
   this.resizeObserver=new ResizeObserver(()=>this.render());
  }
  attach(host){if(this.host){this.host.classList.remove('is-live');this.resizeObserver.unobserve(this.host);}this.host=host;host.append(this.canvas);host.classList.add('is-live');this.resizeObserver.observe(host);this.render();}
  load(buffer){
   const gl=this.gl;this.stop();const m=this.model=decode(buffer);this.angle=m.camera.slice();this.target=this.angle.slice();this.zoom=1;this.motionTime=0;
   if(this.software){
    this.projected=new Float32Array(m.p.length);this.edges=edgeIndices(m.ix);this.faces=[];this.fractalTexture=null;
    for(let i=0;i<m.ix.length;i+=3){const a=m.ix[i]*3,b=m.ix[i+1]*3,c=m.ix[i+2]*3,normal=[0,1,2].map(k=>(m.norm[a+k]+m.norm[b+k]+m.norm[c+k])/3),length=Math.hypot(...normal)||1;
     this.faces.push({a,b,c,n:normal.map(v=>v/length),color:[0,1,2].map(k=>(m.co[a+k]+m.co[b+k]+m.co[c+k])/3),depth:0});
    }
    if(m.fractal)this.prepareFractal();this.render();return;
   }
   for(const b of this.buffers)gl.deleteBuffer(b);this.buffers=[];gl.useProgram(this.program);
   for(const [name,values,typ,normalized] of [['position',m.p,gl.FLOAT,false],['normal',m.norm,gl.FLOAT,false],['color',m.co,gl.UNSIGNED_BYTE,true]]){
    const b=gl.createBuffer();this.buffers.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,values,gl.STATIC_DRAW);const loc=gl.getAttribLocation(this.program,name);gl.vertexAttribPointer(loc,3,typ,normalized,0,0);gl.enableVertexAttribArray(loc);
   }
   const b=gl.createBuffer();this.buffers.push(b);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,b);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,m.ix,gl.STATIC_DRAW);this.surfaceBuffer=b;
   const edges=edgeIndices(m.ix),wire=gl.createBuffer();this.buffers.push(wire);this.wireBuffer=wire;this.edgeCount=edges.length;
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,wire);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,edges,gl.STATIC_DRAW);this.render();
  }
  render(){
   if(!this.alive||!this.model||!this.host||document.hidden)return;
   const rect=this.host.getBoundingClientRect();if(rect.width<1||rect.height<1)return;
   const dpr=Math.min(window.devicePixelRatio||1,this.preview?1:this.software?1.25:1.75),w=Math.max(1,Math.min(1400,Math.round(rect.width*dpr))),h=Math.max(1,Math.min(1100,Math.round(rect.height*dpr)));
   if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}
   if(this.software){this.renderSoftware(w,h);return;}
   const gl=this.gl;gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);gl.uniform2fv(this.uniforms.angles,this.angle);
   const light=this.lighting();gl.uniform3fv(this.uniforms.lightDirection,light.direction);gl.uniform3fv(this.uniforms.lightTint,light.tint);
   gl.uniform1f(this.uniforms.aspect,w/h);gl.uniform1f(this.uniforms.size,this.model.radius*1.05/this.zoom * Math.max(1,h/w));gl.uniform1f(this.uniforms.unlit,this.model.unlit);gl.uniform1f(this.uniforms.fractal,this.model.fractal);
   const wire=this.mode==='wire';gl.uniform1f(this.uniforms.displayMode,wire?2:this.mode==='glow'?1:0);
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,wire?this.wireBuffer:this.surfaceBuffer);
   gl.drawElements(wire?gl.LINES:gl.TRIANGLES,wire?this.edgeCount:this.model.ix.length,gl.UNSIGNED_SHORT,0);this.frames++;
  }
  prepareFractal(){
   const t=document.createElement('canvas');t.width=264;t.height=208;const c=t.getContext('2d'),im=c.createImageData(t.width,t.height),p=this.model.p;
   const xs=[],zs=[];for(let i=0;i<p.length;i+=3){xs.push(p[i]);zs.push(p[i+2]);}this.fractalBounds=[Math.min(...xs),Math.max(...xs),Math.min(...zs),Math.max(...zs)];
   const [x0,x1,z0,z1]=this.fractalBounds;
   for(let y=0;y<t.height;y++)for(let x=0;x<t.width;x++){
    let a=(x0+(x+.5)/t.width*(x1-x0))*1.3469388,b=(z0+(y+.5)/t.height*(z1-z0))*1.3469388,count=180;
    for(let j=0;j<180;j++){const v=a*a-b*b-.74543;b=2*a*b+.11301;a=v;if(a*a+b*b>100){count=j+1-Math.log2(Math.log2(Math.hypot(a,b)));break;}}
    const ring=.5+.5*Math.cos(count*.53),level=count>178?.09:Math.min(1,count/25)*(.24+.76*ring),offset=(y*t.width+x)*4;
    for(let k=0;k<3;k++)im.data[offset+k]=255*([.025,.065,.05][k]+([.77,.94,.83][k]-[.025,.065,.05][k])*level);im.data[offset+3]=255;
   }
   c.putImageData(im,0,0);this.fractalTexture=t;
  }
  renderSoftware(w,h){
   const start=performance.now(),ctx=this.ctx,m=this.model,p=m.p,q=this.projected,ca=Math.cos(this.angle[0]),sa=Math.sin(this.angle[0]),cb=Math.cos(this.angle[1]),sb=Math.sin(this.angle[1]);
   const scale=Math.min(w,h)/(m.radius*2.1)*this.zoom,illumination=this.lighting();
   const rotate=(x,y,z)=>{const xx=cb*x+sb*z,zz=-sb*x+cb*z;return [xx,ca*y-sa*zz,sa*y+ca*zz];};
   const project=(x,y,z)=>{const v=rotate(x,y,z);return [w/2+v[0]*scale,h/2-v[1]*scale,v[2]];};
   ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,w,h);
   for(let i=0;i<p.length;i+=3){const v=project(p[i],p[i+1],p[i+2]);q[i]=v[0];q[i+1]=v[1];q[i+2]=v[2];}
   if(this.mode==='wire'){
    ctx.lineWidth=.8;ctx.strokeStyle='#a7f2cb';
    for(let band=0;band<3;band++){ctx.globalAlpha=.22+band*.29;ctx.beginPath();for(let i=0;i<this.edges.length;i+=2){const a=this.edges[i]*3,b=this.edges[i+1]*3,depth=(q[a+2]+q[b+2])/(2*m.radius);if(Math.min(2,Math.max(0,Math.floor((depth+1)*1.5)))!==band)continue;ctx.moveTo(q[a],q[a+1]);ctx.lineTo(q[b],q[b+1]);}ctx.stroke();}ctx.globalAlpha=1;
   }else if(m.fractal){
    const [x0,x1,z0,z1]=this.fractalBounds,a=project(x0,0,z0),b=project(x1,0,z0),c=project(x0,0,z1),t=this.fractalTexture;
    ctx.setTransform((b[0]-a[0])/t.width,(b[1]-a[1])/t.width,(c[0]-a[0])/t.height,(c[1]-a[1])/t.height,a[0],a[1]);ctx.drawImage(t,0,0);ctx.setTransform(1,0,0,1,0,0);
   }else{
    for(const f of this.faces)f.depth=q[f.a+2]+q[f.b+2]+q[f.c+2];this.faces.sort((a,b)=>a.depth-b.depth);
    for(const f of this.faces){let n=rotate(...f.n);if(n[2]<0)n=n.map(v=>-v);const diffuse=Math.max(0,n[0]*illumination.direction[0]+n[1]*illumination.direction[1]+n[2]*illumination.direction[2]),fill=Math.max(0,n[0]*.808-n[1]*.115+n[2]*.577),rim=Math.pow(1-Math.abs(n[2]),2.5);
     const glow=this.mode==='glow'?rim*.4:rim*.13;
     ctx.fillStyle='rgb('+f.color.map((v,k)=>Math.min(255,Math.round(v*(m.unlit?1:.28+.68*diffuse*illumination.tint[k]+.16*fill)+[46,191,120][k]*glow))).join(',')+')';
     ctx.beginPath();ctx.moveTo(q[f.a],q[f.a+1]);ctx.lineTo(q[f.b],q[f.b+1]);ctx.lineTo(q[f.c],q[f.c+1]);ctx.closePath();ctx.fill();ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=.45;ctx.stroke();
    }
   }
   this.frames++;this.drawCost=performance.now()-start;
  }
  move(pitch,yaw,smooth=true){this.target=[Math.max(-1.5,Math.min(1.5,pitch)),yaw];if(smooth)this.start();else{this.angle=this.target.slice();this.render();}}
  lighting(){return this.dynamicLight?lightAt(this.lightPhase):{direction:[-.366,.488,.793],tint:[1,1,1]};}
  start(){if(this.raf||!this.alive)return;let previous=performance.now();const tick=t=>{
    this.raf=0;if(document.hidden||!this.host||!this.alive)return;
    const interval=this.software?Math.max(this.preview?83:67,Math.min(500,(this.drawCost||0)*(this.preview?this.previewCount*3:1.5))):this.preview?50:32;
    if(t-previous<interval){this.raf=requestAnimationFrame(tick);return;}const dt=Math.min(.5,(t-previous)/1000);previous=t;
    if(this.auto){this.motionTime+=dt;
     if(this.sway){this.target=[this.model.camera[0]+this.swayPitch*Math.sin(this.motionTime*.16),this.model.camera[1]+this.swayYaw*Math.sin(this.motionTime*.12)];}
     else{const delta=dt*(this.dynamicLight ? .12 : .24);this.target[1]+=delta;this.angle[1]+=delta;}
     if(this.dynamicLight)this.lightPhase+=dt*.22;
    }
    let distance=0;for(let i=0;i<2;i++){const diff=this.target[i]-this.angle[i];distance+=Math.abs(diff);this.angle[i]+=diff*(1-Math.exp(-6*dt));}
    this.render();if(this.auto||distance>.001)this.raf=requestAnimationFrame(tick);
   };this.raf=requestAnimationFrame(tick);}
  stop(){cancelAnimationFrame(this.raf);this.raf=0;this.auto=false;}
  detach(){this.stop();this.canvas.remove();if(this.host){this.host.classList.remove('is-live');this.resizeObserver.unobserve(this.host);}this.host=null;}
  reset(){this.stop();if(!this.model)return;this.angle=this.model.camera.slice();this.target=this.angle.slice();this.zoom=1;this.motionTime=0;this.render();}
  setMode(mode){if(!['surface','glow','wire'].includes(mode))return;this.mode=mode;this.render();}
  setZoom(z){this.zoom=Math.max(.65,Math.min(2.4,z));this.render();}
  dispose(){this.detach();this.resizeObserver.disconnect();if(this.software){this.alive=false;this.model=null;this.faces=null;this.fractalTexture=null;return;}const gl=this.gl;for(const b of this.buffers)gl.deleteBuffer(b);gl.deleteProgram(this.program);gl.getExtension('WEBGL_lose_context')?.loseContext();this.alive=false;}
 }
 window.MDCGeometry={Viewer,decode,edgeIndices,lightAt};
})();
