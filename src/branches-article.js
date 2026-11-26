/* Interactive plates for The Freedom of Branches. Each model has a fully
   drawn initial view in the article HTML. The controls enhance that view. */
(() => {
  'use strict';
  function branchModels(root, en) {
    const r = n => Number(n.toFixed(1));
    const pt = p => r(p[0]) + ',' + r(p[1]);
    const polar = (length, theta, phi) => [length * Math.sin(theta) * Math.cos(phi),length * Math.cos(theta),length * Math.sin(theta) * Math.sin(phi)];
    const plus = (p,d) => p.map((v,k) => v+d[k]);
    const lerp = (p,q,t) => p.map((v,i) => v+(q[i]-v)*t);
    function seeded(seed) {
      let state=seed;
      return () => {state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
    }
    function organism(name) {
      const wood=[],ends=[];
      const random=seeded(name==='Faggio'?1841:name==='Bronchi'?994:713);
      const between=(a,b)=>a+(b-a)*random();
      function limb(p,q,width,tip,parent,generation) {
        wood.push({p,q,width,tip,parent,generation});
        return wood.length-1;
      }
      if(name==='Faggio') {
        // Main axes persist through several annual extensions. Side branches arise at distinct heights.
        function shoot(p,len,theta,phi,w,order,parent) {
          const count=order===0?9:order===1?5:order===2?3:2;
          let axis=parent;
          for(let k=0;k<count;k++){
            theta=Math.max(.04,theta+between(-.10,.07));
            phi+=between(-.14,.14);
            const q=plus(p,polar(len*(1-.042*k),theta,phi));
            const w2=w*(order===0?.81:.77); const n=limb(p,q,w,w2,axis,order);
            if(order<3&&(order>0||k>=1)){
              const angle=order===0?between(.65,1.3):Math.max(.18,theta+between(-.52,.52));
              const direction=order===0?k*2.399+between(-.35,.35):phi+(k%2?1:-1)*between(.46,1.08);
              shoot(q,len*(order===0?between(.71,.98):between(.48,.67)),angle,direction,w*.57,order+1,n);
            }
            p=q;w=w2;axis=n;
          }
          ends.push(axis);
        }
        shoot([0,0,0],16,.05,.7,7.8,0,-1);
      } else if(name==='Bronchi') {
        // The trachea divides into two main airways, feeding offset groups of distal branches.
        const top=[0,115,0], carina=[0,84,0], root=limb(top,carina,6.2,5.8,-1,0);
        function fork(p,base,L,w,depth,parent,polarity) {
          const alpha=base+between(-.14,.14),z=between(-.25,.25)*L;
          const q=[p[0]+Math.sin(alpha)*L, p[1]-Math.cos(alpha)*L, p[2]+z];
          const n=limb(p,q,w,w*.8,parent,depth);
          if(depth>=5){ends.push(n);return;}
          const spread=between(.51,.78);
          fork(q,alpha-spread,L*between(.63,.79),w*.68,depth+1,n,polarity);
          fork(q,alpha+spread,L*between(.57,.77),w*.64,depth+1,n,polarity);
        }
        for(const k of [-1,1]){
          const p=[k*(k<0?18:21),63,k*2];
          const n=limb(carina,p,4.8,4.1,root,1);
          fork(p,k*1.83,16,3.4,1,n,k);
          const lower=[k*24,42,0];
          const m=limb(p,lower,4.2,3.2,n,2);
          if(k===-1)fork(lerp(p,lower,.54),k*1.25,12,2.2,2,m,k);
          fork(lower,k*.86,19,2.8,1,m,k);
          fork(lower,k*(-.15),15,2.3,2,m,k);
        }
      } else {
        // Repeated budding on an accreting, rounded skeletal axis. Branch radii remain substantial at the tip.
        function antler(p,len,theta,phi,w,depth,parent) {
          let last=parent;
          const nseg=depth===0?4:3;
          for(let k=0;k<nseg;k++){
            const q=plus(p,polar(len,theta,phi));
            const wi=w*(1-.06*k);last=limb(p,q,wi,wi*.94,last,depth);
            if(depth<3&&(depth===0||k===1)){
              const yaw=depth===0? k*2.21+.47+between(-.2,.2):phi+(random()<.5?-1:1)*between(.8,1.8);
              const tilt=depth===0?between(.92,1.32):between(.28,.91);
              antler(q,len*(depth===0?between(.89,1.12):between(.57,.81)),tilt,yaw,wi*.72,depth+1,last);
            }
            if(depth===1&&k===2)antler(q,len*.69,.31,phi+.4,wi*.71,depth+1,last);
            p=q;theta=Math.max(.07,theta-.12+between(-.08,.07));phi+=between(-.15,.15);
          }
          ends.push(last);
        }
        antler([0,0,0],15,.16,1.45,12,0,-1);
        for(let j=0;j<5;j++){
          const phi=.3+j*2*Math.PI/5;
          antler([Math.cos(phi)*4,1.5,Math.sin(phi)*4],between(10,13),between(.9,1.14),phi,between(6.5,8),1,0);
        }
      }
      const paths=ends.map(i=>{
        const result=[];let j=i;
        while(j>=0){result.push(j);j=wood[j].parent;}
        return result.reverse();
      }).filter(p=>p.length>=4);
      return {wood,ends,paths,name};
    }
    const models=['Faggio','Bronchi','Corallo'].map(organism);
    const palette=[
      ['#b19b70','#a9a57b','#b4c5a1','#adceb5'],
      ['#6f9eaa','#87b5bb','#a1c5c5','#bfd9ce','#cbe5da','#d7e6d9'],
      ['#be886b','#d0a37e','#e4b891','#e8c9a6']
    ];
    function project(p,angle,kind){
      const a=angle*Math.PI/180;
      const depth=p[0]*Math.sin(a)+p[2]*Math.cos(a),side=p[0]*Math.cos(a)-p[2]*Math.sin(a);
      const sy=kind===1?0:.14;
      return [side,p[1]+sy*depth,depth];
    }
    function modelSvg(kind,angle,index=0,mode='normal',overlay=false){
      const model=models[kind], {wood,paths}=model;
      const coords=wood.map(b=>[project(b.p,angle,kind),project(b.q,angle,kind)]);
      const all=coords.flat(),xmax=Math.max(...all.map(p=>p[0])),xmin=Math.min(...all.map(p=>p[0])), ymax=Math.max(...all.map(p=>p[1])),ymin=Math.min(...all.map(p=>p[1]));
      const scale=Math.min((kind===1?159:178)/(xmax-xmin),174/(ymax-ymin));
      const mc=(xmax+xmin)/2;
      const to=p=>[103+(p[0]-mc)*scale,195-(p[1]-ymin)*scale,p[2]];
      const geom=coords.map(pair=>pair.map(to));
      const ranked=paths.filter(p=>p.length>=(kind===0?6:4)).slice().sort((a,b)=>geom[a.at(-1)][1][0]-geom[b.at(-1)][1][0]);
      const pick=ranked[Math.floor(ranked.length*[.17,.79,.58][index%3])];
      const set=new Set(pick);
      const order=wood.map((_,i)=>i).sort((a,b)=>coords[a][1][2]-coords[b][1][2]);
      const grouped={};
      function add(color,d){ if(!grouped[color])grouped[color]=[];grouped[color].push(d); }
      let features='';
      const dark=mode==='trace'||mode==='isolate';
      if(kind===1 && !dark){
        // Delicate lobar envelopes in frontal view; these are orientation cues rather than reconstructed anatomy.
        const center=to(project([0,0,0],angle,kind))[0];const cos=Math.abs(Math.cos(angle*Math.PI/180));
        const lungW=79*(.59+.41*cos);
        features+='<g fill="#62948d" fill-opacity=".075" stroke="#9bad9e" stroke-opacity=".32" stroke-width=".8">';
        for(const side of [-1,1]){
          const x=(d)=>r(center+side*lungW*d), y=(frac)=>r(22+frac*171);
          features+='<path d="M'+x(.31)+','+y(.18)+' C'+x(.55)+','+y(-.07)+' '+x(1.05)+','+y(.33)+' '+x(1.06)+','+y(.88)+' Q'+x(1.08)+','+y(1.08)+' '+x(.72)+','+y(1.01)+' L'+x(.26)+','+y(.97)+' Q'+x(.10)+','+y(.88)+' '+x(.18)+','+y(.64)+' Q'+x(.01)+','+y(.45)+' '+x(.31)+','+y(.18)+'Z"/>';
        }features+='</g>';
      }
      const contour=[];
      for(const i of order){
        const b=wood[i], [p,q]=geom[i];
        if(mode==='isolate'&&!set.has(i))continue;
        const color=dark?(set.has(i)?'#efc879':'#38534b'):palette[kind][Math.min(palette[kind].length-1,b.generation)];
        const w=Math.max(kind===0?.27:.4,b.width*scale/2), t=Math.max(kind===0?.22:.32,b.tip*scale/2);
        const dx=q[0]-p[0],dy=q[1]-p[1], len=Math.max(.1,Math.hypot(dx,dy)),side=[-dy/len,dx/len];
        const offset=(o,s)=>[o[0]+side[0]*s,o[1]+side[1]*s];
        add(color,'M'+pt(offset(p,w))+'L'+pt(offset(q,t))+'Q'+pt([q[0]+dx*t/len*1.1,q[1]+dy*t/len*1.1])+' '+pt(offset(q,-t))+'L'+pt(offset(p,-w))+'Z');
        if(kind===2&&!dark&&i%2===0){
          for(const f of [.27,.66]){const mid=lerp(p,q,f);const d=Math.max(.54,w*.15);
            contour.push('M'+pt(offset(mid,w*.32))+'l'+r(d*.6)+','+r(d*.35));}
        }
        if(kind===0&&overlay&&model.ends.includes(i)){
          const mid=lerp(p,q,.84); const ex=mid[0]+(i%2?3:-3), ey=mid[1]-5;
          add('#9bc09a','M'+pt(mid)+'Q'+r(ex-2)+','+r(ey+.6)+' '+r(ex)+','+r(ey)+'Q'+r(ex+1.8)+','+r(ey+3)+' '+pt(mid)+'Z');
        }
      }
      let out=features+Object.entries(grouped).map(([color,polys])=>'<path fill="'+color+'" d="'+polys.join('')+'"/>').join('');
      if(contour.length)out+='<path d="'+contour.join('')+'" fill="none" stroke="#825f50" stroke-width=".8" stroke-linecap="round" opacity=".6"/>';
      if(overlay && kind!==0){
        if(kind===1){
          const d=pick.map((idx,k)=>(k===0?'M'+pt(geom[idx][0]):'')+'L'+pt(geom[idx][1])).join('');
          out+='<path fill="none" stroke="#f4cc76" stroke-width="2.1" stroke-dasharray="3 3" d="'+d+'"/>';
          for(const ii of [1,Math.floor(pick.length/2)]){const [p,q]=geom[pick[ii]];out+=arrow(p,q,'#ffc969',.64);}
        }else{
          for(const [x,y,h] of [[4,49,16],[11,91,23],[10,146,28],[113,117,18],[151,68,38],[149,157,41]]){
            out+='<path d="M'+x+','+y+'q'+(h/2)+',-6 '+h+',-1" fill="none" stroke="#87d7e6" stroke-width="1.45"/>';
            out+=arrow([x+h-8,y-4],[x+h+2,y],'#87d7e6',.87);
          }
        }
      }
      if(dark){const p=geom[pick.at(-1)][1];out+='<circle cx="'+r(p[0])+'" cy="'+r(p[1])+'" r="3.4" fill="#f1cb84" stroke="#18322d" stroke-width="1.1"/>';}
      return out;
    }
    function arrow(p,q,color,t){
      const a=lerp(p,q,t),angle=Math.atan2(q[1]-p[1],q[0]-p[0])*180/Math.PI;
      return '<path transform="translate('+pt(a).replace(',',' ')+') rotate('+r(angle)+')" d="M 0,0 -5,-2.9 -4,0 -5,2.9Z" fill="'+color+'"/>';
    }
    function koch(order,A,B) {
      let nodes=[A,B];
      for(let step=0;step<order;step++){
        const n=[];
        for(let j=0;j<nodes.length-1;j++){
          const a=nodes[j],b=nodes[j+1],d=lerp(a,b,1/3),e=lerp(a,b,2/3);
          const dx=(b[0]-a[0])/3,dy=(b[1]-a[1])/3;
          n.push(a,d,[d[0]+dx*.5+dy*Math.sqrt(3)/2,d[1]-dx*Math.sqrt(3)/2+dy*.5],e);
        }n.push(nodes.at(-1));nodes=n;
      }return nodes;
    }
    function points(nodeList){return 'M'+nodeList.map(pt).join('L');}
    function kPath(order,A,B,stroke,width=2,extra=''){
      return '<path d="'+points(koch(order,A,B))+'" fill="none" stroke="'+stroke+'" stroke-width="'+width+'" stroke-linejoin="round" '+extra+'/>';
    }
    function kochFig(order){
      const A=[26,151], B=[524,151];
      const previous=order?kPath(order-1,A,B,'#49675d',1.4,'stroke-dasharray="3 4"'):'';
      const curve=kPath(order,A,B,'#bdd9bc',2.2);
      const pts=koch(order,A,B); const segment=points(pts.slice(0,order===0?2:Math.min(5,pts.length)));
      const colored='<path fill="none" stroke="#efc978" stroke-linejoin="round" stroke-width="3" d="'+segment+'"/>';
      return '<path d="M26 159 H524 M26 156v7 M524 156v7" fill="none" stroke="#517068" stroke-width="1"/>'+previous+curve+colored;
    }
    function zoomFig(sel){
      const pts=koch(1,[20,108],[238,108]),cols=['#ecc47b','#ecc47b','#ecc47b','#ecc47b'];
      const detail=kPath(4,[311,108],[529,108],'#e9c179',1.9);
      return kPath(5,[20,108],[238,108],'#9dc5af',1.6)+kPath(4,pts[sel],pts[sel+1],cols[sel],3)+
       '<path d="M261 85h24m-6 -4 7 4-7 4" stroke="#869f92" stroke-width="1.5" fill="none"/>'+detail;
    }
    const containingFigure = selector => root.querySelector(selector)?.closest('figure');
    const overview = containingFigure('[data-a-flux]');
    const trace = containingFigure('[data-a-isolate]');
    const k = containingFigure('[data-koch]');
    const z = containingFigure('[data-zoom-koch]');
    if(!overview||!trace||!k||!z)return;
    const overlay=overview.querySelector('[data-a-flux]'),rotation=overview.querySelector('[data-a-rotation]');
    const drawOverview=()=>{
      const on=overlay.getAttribute('aria-pressed')==='true';
      overview.querySelectorAll('[data-a-model]').forEach((g,i)=>g.innerHTML=modelSvg(i,i===1?Number(rotation.value)*.65:Number(rotation.value),0,'normal',on));
      overview.querySelector('[data-a-deg]').textContent=rotation.value+'°';
      overview.querySelector('[data-a-overlay-status]').hidden=!on;
      overview.querySelector('.ice-final').hidden=!on;
    };
    overlay.addEventListener('click',()=>{overlay.setAttribute('aria-pressed',String(overlay.getAttribute('aria-pressed')!=='true'));drawOverview();});
    rotation.addEventListener('input',drawOverview);
    let terminal=0;
    const isolate=trace.querySelector('[data-a-isolate]');
    function drawTrace(){
      const single=isolate.getAttribute('aria-pressed')==='true';
      trace.querySelectorAll('[data-a-model]').forEach((g,i)=>g.innerHTML=modelSvg(i,0,terminal,single?'isolate':'trace'));
      trace.querySelector('[data-a-path-status]').textContent=en ? `Tip ${terminal+1} of 3` : `Estremità ${terminal+1} di 3`;
    }
    trace.querySelector('[data-a-next]').addEventListener('click',()=>{terminal=(terminal+1)%3;drawTrace();});
    isolate.addEventListener('click',()=>{isolate.setAttribute('aria-pressed',String(isolate.getAttribute('aria-pressed')!=='true'));drawTrace();});
    const range=k.querySelector('input');
    range.addEventListener('input',()=>{
      const n=Number(range.value);k.querySelector('[data-koch]').innerHTML=kochFig(n);
      k.querySelector('output').textContent=(en ? 'Step ' : 'Passo ')+n+' · '+(4**n).toLocaleString(en ? 'en-GB' : 'it-IT')+' '+(en ? (n===0?'segment':'segments') : (n===0?'segmento':'segmenti'));
    });
    z.querySelector('select').addEventListener('change',e=>{
      z.querySelector('[data-zoom-koch]').innerHTML=zoomFig(Number(e.target.value));
    });

    root.querySelector('[data-return]').addEventListener('click', () => {
      if (overlay.getAttribute('aria-pressed') !== 'true') overlay.click();
    });
    root.querySelectorAll('.rami-controls').forEach(group => { group.hidden = false; });
  }

  function coralModel(root, en) {
    const dimensions={width:570,height:282};
    // The model uses intrinsic coordinates: +x follows the current and +y points up.
    // Build the colony once; changing the view rotates the existing geometry.
    function branches(){
      let state=14817;
      const random=()=>((state=Math.imul(state,1664525)+1013904223>>>0)/4294967296);
      const segments=[];
      const sum=(a,b,k=1)=>a.map((v,i)=>v+b[i]*k);
      const mix=(a,b,k)=>a.map((v,i)=>v*(1-k)+b[i]*k);
      const norm=a=>{const m=Math.hypot(...a);return a.map(v=>v/m)};
      function grow(start,axis,length,radius,order){
        const finish=sum(start,axis,length);
        const control=sum(mix(start,finish,.5),[(random()-.5)*.20,.03,(random()-.5)*.20],length);
        const bumps=[];
        for(let i=0;i<Math.max(2,order*2);i++)bumps.push([.13+.74*random(),random()*Math.PI*2,.55+random()*.45]);
        segments.push({start,control,finish,radius,order,bumps});
        if(order===0)return;
        let n=order===3?3:2;
        for(let i=0;i<n;i++){
          const angle=2*Math.PI*(i/n+random()*.26);
          const spread=.39+.31*random();
          const v=norm([axis[0]*.83-.08+spread*Math.cos(angle),.56+axis[1]*.52+random()*.18,axis[2]*.78+spread*Math.sin(angle)]);
          grow(mix(start,finish,.72+random()*.27),v,length*(.56+random()*.18),radius*(.56+random()*.19),order-1);
        }
      }
      for(let i=0;i<12;i++){
        const theta=i/12*2*Math.PI+.24*random();
        const up=Math.max(-Math.cos(theta),0);
        const base=[Math.cos(theta)*13,0,Math.sin(theta)*11];
        grow(base,norm([Math.cos(theta)*(.73+up*.22)-.20,.45+random()*.72,Math.sin(theta)*(.51+random()*.22)]),37+up*23+random()*14,5.2+random()*2.5,3);
      }
      grow([0,0,0],[-.12,.99,0],55,8,3);
      return segments;
    }
    const model=branches();
    const f=x=>x.toFixed(1);
    function paint(degrees) {
      const angle=degrees*Math.PI/180, c=Math.cos(angle), s=Math.sin(angle);
      function project([x,y,z]){
        const across=c*x-s*z, depth=s*x+c*z;
        return [dimensions.width/2+across*1.73,224-y*1.58+depth*.40,depth];
      }
      const render=[];
      for(const branch of model){
        const {radius,order}=branch;
        const a=project(branch.start), b=project(branch.control), d=project(branch.finish);
        const dx=d[0]-a[0],dy=d[1]-a[1],m=Math.max(.1,Math.hypot(dx,dy)),nx=-dy/m,ny=dx/m;
        const light=Math.max(0,Math.min(1,(a[2]+d[2]+155)/280));
        const base=[40,83,76],pale=[160,199,161];
        const rgb=(bias)=>'rgb('+base.map((v,i)=>Math.round(v+(pale[i]-v)*Math.min(1,Math.max(0,light*.79+bias)))).join(',')+')';
        const point=(p,k)=>f(p[0]+nx*k)+','+f(p[1]+ny*k);
        const wide=radius*1.36,narrow=radius*(order===0?.90:1.08);
        const outline='M'+point(a,wide)+' Q'+point(b,wide)+' '+point(d,narrow)+' Q'+f(d[0]+dx/m*narrow*1.6)+','+f(d[1]+dy/m*narrow*1.6)+' '+point(d,-narrow)+' Q'+point(b,-wide)+' '+point(a,-wide)+' Z';
        let svg='<path d="'+outline+'" fill="'+rgb(.09)+'" stroke="'+rgb(-.14)+'" stroke-width="1.1"/>';
        svg+='<path d="M'+point(a,-wide*.55)+' Q'+point(b,-wide*.60)+' '+point(d,-narrow*.54)+'" fill="none" stroke="'+rgb(.35)+'" stroke-width="'+f(Math.max(.85,radius*.27))+'" stroke-linecap="round"/>';
        for(const [t,phi,scale] of branch.bumps){
          const side=Math.cos(phi), vv=(1-t)*(1-t), ww=t*t, kk=2*t*(1-t);
          const bx=vv*a[0]+kk*b[0]+ww*d[0],by=vv*a[1]+kk*b[1]+ww*d[1];
          const r=wide*(.28+.21*Math.abs(side))*scale;
          const qx=bx+nx*side*wide*.9,qy=by+ny*side*wide*.9;
          svg+='<circle cx="'+f(qx)+'" cy="'+f(qy)+'" r="'+f(r)+'" fill="'+rgb(.20)+'"/>';
        }
        render.push([(a[2]+d[2])/2,svg]);
      }
      // A shared, encrusting holdfast joins the oldest branches near the substrate.
      const shoulder=project([0,5,0]), foot=project([0,-1,0]);
      render.push([13,'<path d="M'+f(foot[0]-26)+','+f(foot[1]+2)+' Q'+f(shoulder[0]-21)+','+f(shoulder[1]-5)+' '+f(shoulder[0])+','+f(shoulder[1]-4)+' Q'+f(shoulder[0]+18)+','+f(shoulder[1]-5)+' '+f(foot[0]+28)+','+f(foot[1]+2)+' Q'+f(foot[0])+','+f(foot[1]+9)+' '+f(foot[0]-26)+','+f(foot[1]+2)+' Z" fill="#6f977d" stroke="#526f62"/>']);
      render.sort((a,b)=>a[0]-b[0]);
      let out='<ellipse cx="285" cy="225" rx="112" ry="20" fill="#16302b" opacity=".7"/><ellipse cx="285" cy="225" rx="130" ry="26" fill="none" stroke="#315049" stroke-dasharray="2 5"/>'+render.map(x=>x[1]).join('');
      // Arrow below the colony follows the same azimuth as the upstream morphology.
      const start=project([-70,-23,0]),end=project([70,-23,0]);
      out+='<path d="M'+f(start[0])+','+f(start[1])+' L'+f(end[0])+','+f(end[1])+'" fill="none" stroke="#93c9dd" stroke-width="2.8" marker-end="url(#branches-bp-water-11)"/>';
      return out;
    }
    const slider=root.querySelector('#branches-bp-coral-view'), layer=root.querySelector('#branches-bp-coral-layer');
    if(slider&&layer){
      const render=()=>{layer.innerHTML=paint(Number(slider.value));slider.setAttribute('aria-valuetext',slider.value+(en ? ' degrees' : ' gradi'));};
      slider.addEventListener('input',render);
      root.querySelector('#branches-bp-rotation-controls').hidden=false;
    }
  }

  // Both clusters start with the same geometry and differ only by their random seed.
  function aggregation(root, en) {
    const half = 96, width = 2 * half + 1, limit = 640, initial = 240;
    const seeds = [15031, 11009];
    function cluster(seed) {
      let state = seed >>> 0, radius = 0;
      const sites = new Uint8Array(width * width);
      const points = [[0, 0]], index = (x, y) => (y + half) * width + x + half;
      sites[index(0, 0)] = 1;
      function random() {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        return (state >>> 0) / 4294967296;
      }
      function grow() {
        const launch = Math.ceil(radius) + 6;
        const kill = Math.min(half - 2, 2 * launch + 6);
        for (;;) {
          const angle = 2 * Math.PI * random();
          let x = Math.round(launch * Math.cos(angle)), y = Math.round(launch * Math.sin(angle));
          for (;;) {
            const i = index(x, y);
            if (sites[i-1] || sites[i+1] || sites[i-width] || sites[i+width]) {
              sites[i] = 1;
              points.push([x, y]);
              radius = Math.max(radius, Math.hypot(x, y));
              return;
            }
            const d = Math.floor(4 * random());
            if (d === 0) x++; else if (d === 1) x--; else if (d === 2) y++; else y--;
            if (x * x + y * y > kill * kill) break;
          }
        }
      }
      return {grow, points};
    }
    function shapes(points, n) {
      const parts = ['', '', '', ''];
      for (let i = 0; i < n; i++) {
        const [x, y] = points[i];
        parts[Math.min(3, Math.floor(4 * i / n))] += 'M' + x + ' ' + y + 'h1v1h-1z';
      }
      return parts;
    }
    const panel = root.querySelector('#figura-15');
    if (!panel) return;
    const play = panel.querySelector('[data-ice-play]'), reset = panel.querySelector('[data-ice-reset]');
    const step = panel.querySelector('[data-ice-step]'), report = panel.querySelector('[data-ice-count]');
    const fields = [...panel.querySelectorAll('[data-ice-field]')];
    const groups = fields.map(svg => [...svg.querySelectorAll('[data-ice-band]')]);
    const samples = seeds.map(cluster);
    let n = initial, playing = false, frame = 0, previous = 0;
    function pause() {
      playing = false;
      cancelAnimationFrame(frame);
      play.textContent = en ? 'Start growth' : 'Avvia la crescita';
      play.setAttribute('aria-pressed', 'false');
      report.setAttribute('aria-live', 'polite');
    }
    function paint() {
      fields.forEach((svg, k) => {
        const sample = samples[k];
        while (sample.points.length < n) sample.grow();
        const curves = shapes(sample.points, n);
        curves.forEach((d, band) => groups[k][band].setAttribute('d', d));
      });
      report.textContent = en
        ? (n === 1 ? '1 particle per cluster' : n + ' particles per cluster')
        : (n === 1 ? '1 particella per aggregato' : n + ' particelle per aggregato');
      if (n === limit) pause();
      play.disabled = step.disabled = n === limit;
    }
    function tick(t) {
      if (!playing) return;
      if (t - previous >= 55) {
        n = Math.min(limit, n + 5);
        paint();
        previous = t;
      }
      if (playing) frame = requestAnimationFrame(tick);
    }
    play.addEventListener('click', () => {
      if (playing) return pause();
      playing = true;
      report.setAttribute('aria-live', 'off');
      play.textContent = en ? 'Pause' : 'Pausa';
      play.setAttribute('aria-pressed', 'true');
      frame = requestAnimationFrame(tick);
    });
    reset.addEventListener('click', () => {pause(); n = 1; paint();});
    step.addEventListener('click', () => {pause(); n = Math.min(limit, n + 25); paint();});

    panel.querySelector('[data-ice-controls]').hidden = false;
    return pause;
  }

  function coastMeasurement(root) {
    const figure = root.querySelector('[data-ruler]');
    if (!figure) return;
    const control = figure.querySelector('[data-ruler-input]');
    const reading = figure.querySelector('[data-ruler-reading]');
    const layers = figure.querySelectorAll('[data-ruler-layer]');
    function measure() {
      for (const layer of layers) {
        if (layer.dataset.rulerLayer === control.value) layer.removeAttribute('display');
        else layer.setAttribute('display', 'none');
      }
      reading.textContent = control.selectedOptions[0].dataset.reading;
    }
    control.addEventListener('change', measure);
    measure();
    control.closest('[data-ruler-control]').hidden = false;
  }

  const mounted = new WeakMap();
  let activeRoot = null;
  function pause() {
    mounted.get(activeRoot)?.();
  }
  function refresh() {
    const view = document.querySelector('[data-view]:not([hidden])') || document;
    const root = view.querySelector('[data-branches-article]');
    if (activeRoot === root) return;
    pause();
    activeRoot = root;
    if (!root || mounted.has(root)) return;
    const en = root.lang === 'en';
    coastMeasurement(root);
    branchModels(root, en);
    coralModel(root, en);
    mounted.set(root, aggregation(root, en));
  }
  // Language links already point to the corresponding page or offline route.
  // Retain the plate being read even when the reader reached it by scrolling.
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-language]');
    if (!link || !activeRoot || link.dataset.language === activeRoot.lang) return;
    const headerBottom = Math.max(0, document.querySelector('header.header')?.getBoundingClientRect().bottom || 0);
    const visibleHeight = node => {
      const bounds = node.getBoundingClientRect();
      return Math.max(0, Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top, headerBottom));
    };
    const portable = document.body.dataset.portable === 'true';
    const anchor = portable ? location.hash.split('#')[2] : location.hash.slice(1);
    const selected = anchor && activeRoot.querySelector('#' + CSS.escape(anchor));
    if (selected && visibleHeight(selected)) return;
    let target = null, largest = 0;
    for (const figure of activeRoot.querySelectorAll('figure[id]')) {
      const height = visibleHeight(figure);
      if (height > largest) { largest = height; target = figure; }
    }
    if (!target) return;
    const url = new URL(link.href, location.href);
    url.hash = portable ? url.hash.split('#').slice(0, 2).join('#')+'#'+target.id : target.id;
    link.href = url.href;
  });
  window.addEventListener('mdc:content-change', refresh);
  window.addEventListener('pagehide', pause);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  refresh();
})();
