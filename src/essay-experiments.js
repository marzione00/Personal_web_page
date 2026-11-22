(() => {
  'use strict';
  const ns = 'http://www.w3.org/2000/svg';
  const en=document.documentElement.lang==='en';
  const tr=(it,eng)=>en?eng:it;
  const green='var(--sd-motion)',orange='var(--sd-boundary)',faded='var(--line)',ink='var(--ink)';
  const formatter = new Intl.NumberFormat(en?'en-GB':'it-IT', {maximumFractionDigits: 2, useGrouping: false});
  const num = x => formatter.format(x);
  function power(base, exponent, modulus) {
    let result = 1;
    while (exponent > 0) {
      if (exponent % 2) result = result * base % modulus;
      base = base * base % modulus;
      exponent = Math.floor(exponent / 2);
    }
    return result;
  }
  function svgElement(parent, tag, attributes, value) {
    const node = document.createElementNS(ns, tag);
    for (const [key, val] of Object.entries(attributes)) node.setAttribute(key, String(val));
    if (value !== undefined) node.textContent = value;
    parent.append(node);
    return node;
  }
  function line(s, x1, y1, x2, y2, color=faded, extra={}) {
    return svgElement(s,'line',{x1,y1,x2,y2,stroke:color,...extra});
  }
  function label(s, x,y,value, anchor='middle',fill=ink,size=15) {
    return svgElement(s,'text',{x,y,'text-anchor':anchor,fill,'font-size':size},value);
  }
  function circle(s,x,y,r,fill,stroke='none',width=1) {
    return svgElement(s,'circle',{cx:x,cy:y,r,fill,stroke,'stroke-width':width});
  }
  function path(s,coords,stroke,width=2,fill='none') {
    return svgElement(s,'path',{d:coords.map(([x,y],i)=>(i===0?'M':'L')+x.toFixed(2)+' '+y.toFixed(2)).join(' '),fill,stroke,'stroke-width':width,'stroke-linejoin':'round'});
  }
  function frame(s,xmin,xmax,ymax,xticks,yticks) {
    const X=x=>55+(x-xmin)*472/(xmax-xmin), Y=y=>172-138*y/ymax;
    for (const y of yticks){line(s,55,Y(y),527,Y(y));label(s,48,Y(y)+4,num(y),'end',ink,14);}
    for (const x of xticks)label(s,X(x),195,num(x),'middle',ink,14);
    return [X,Y];
  }
  function primeChart(s,x,primeData) {
    const {count,est}=primeData;
    const [X,Y]=frame(s,0,100,30,[0,25,50,75,100],[0,10,20,30]);
    const steps=[[X(0),Y(0)]];
    for(let i=1;i<=100;i++){steps.push([X(i),Y(count[i-1])]);if(count[i]!==count[i-1])steps.push([X(i),Y(count[i])]);}
    path(s,steps,green,2.5);
    const smooth=path(s,est.slice(2).map((v,i)=>[X(i+2),Y(v)]),orange);smooth.setAttribute('stroke-dasharray','5 4');
    line(s,X(x),30,X(x),172,ink,{'stroke-dasharray':'3 4'});
    circle(s,X(x),Y(count[x]),4.5,green);circle(s,X(x),Y(est[x]),6,'none',orange,2);
    label(s,55,20,tr('Numero dei primi','Prime count'),'start');label(s,527,217,tr('Soglia','Threshold'),'end');
    return tr(`Soglia ${x} · Primi contati ${count[x]} · Stima ${num(est[x])} · Scarto ${num(est[x]-count[x])}.`,
      `Threshold ${x} · Primes counted ${count[x]} · Estimate ${num(est[x])} · Difference ${num(est[x]-count[x])}.`);
  }
  function orbitChart(s, exponent) {
    const cx=119,cy=104,R=65,now=exponent%10;
    circle(s,cx,cy,R,'none',faded,2);
    for(let j=0;j<10;j++){
      const a=2*Math.PI*j/10-Math.PI/2,x=cx+R*Math.cos(a),y=cy+R*Math.sin(a);
      circle(s,x,y,j===now?9:3.2,j===now?orange:green,j===now?orange:'none',2);
      label(s,cx+(R+19)*Math.cos(a),cy+(R+19)*Math.sin(a)+4,String(power(8,j,33)),'middle',j===now?orange:ink,15);
    }
    label(s,cx,cy-2,'× 8','middle',ink,21);label(s,cx,cy+18,tr('resto per 33','remainder mod 33'),'middle',ink,13);
    const X=k=>250+13*k,Y=v=>168-v*3.6;
    for(const v of [0,16,32]){line(s,250,Y(v),510,Y(v));label(s,245,Y(v)+4,String(v),'end',ink,13);}
    const vals=Array.from({length:21},(_,k)=>power(8,k,33));
    path(s,vals.map((v,k)=>[X(k),Y(v)]),faded,1.4);
    vals.forEach((v,k)=>circle(s,X(k),Y(v),2.8,green));
    circle(s,X(exponent),Y(vals[exponent]),6.8,'none',orange,2.3);
    for(const k of [0,5,10,15,20])label(s,X(k),191,String(k),'middle',ink,13);
    label(s,505,216,tr('Esponente','Exponent'),'end');
    return tr(`Esponente ${exponent} · Resto ${vals[exponent]} · Giri completati ${Math.floor(exponent/10)} · Posizione nel giro ${now}.`,
      `Exponent ${exponent} · Remainder ${vals[exponent]} · Full cycles ${Math.floor(exponent/10)} · Step in cycle ${now}.`);
  }
  function windows(s, delta) {
    const side=151, left=88, bottom=179;
    const X=value=>left+side*value/2773, Y=value=>bottom-side*value/2773;
    for(const value of [0,1000,2000,2773]){
      line(s,X(value),Y(0),X(value),Y(2773));
      line(s,X(0),Y(value),X(2773),Y(value));
    }
    line(s,X(0),Y(0),X(2773),Y(2773),ink,{'stroke-dasharray':'4 3'});
    label(s,82,181,'0','end');label(s,81,33,'2773','end');label(s,239,197,'2773');
    label(s,80,17,tr('Resto dopo lo spostamento','Shifted remainder'),'start',ink,14);
    label(s,243,217,tr('Resto iniziale','First remainder'),'end',ink,14);
    let matches=0;
    for(let x=40;x<=100;x++){
      const first=power(8,x,2773),second=power(8,x+delta,2773);
      if(first===second)matches++;
      circle(s,X(first),Y(second),2.05,green);
    }
    const original=power(8,40,2773), shifted=power(8,40+delta,2773);
    circle(s,X(original),Y(shifted),5.2,'none',orange,1.8);
    label(s,294,70,tr('Al passo 40','At step 40'),'start',orange,18);
    label(s,294,100,tr('Resto iniziale   ','First remainder   ')+original,'start',ink,15);
    label(s,294,124,tr('Secondo resto   ','Second remainder   ')+shifted,'start',ink,15);
    label(s,294,168,matches+tr(' coppie sulla diagonale',' pairs on the diagonal'),'start',green,15);
    return tr(`Spostamento ${delta} · Seconda serie dal passo ${40+delta} a ${100+delta} · Coincidenze ${matches} su 61.`,
      `Shift ${delta} · Second sequence from step ${40+delta} to ${100+delta} · ${matches} of 61 pairs match.`);
  }
  function keys(s,d){
    const raw=d*3,rem=power(8,d,33);
    const X=i=>64+46*i,Y=v=>161-v*3.35;
    line(s,X(0),Y(2),X(10),Y(2),orange,{'stroke-dasharray':'4 4'});
    label(s,X(10),Y(2)-8,tr('messaggio 2','message 2'),'end',orange,13);
    for(let k=0;k<=10;k++){
      const v=power(8,k,33);line(s,X(k),164,X(k),Y(v),faded,{'stroke-width':2});
      circle(s,X(k),Y(v),k===d?6.5:3.5,k===d?orange:green);
      label(s,X(k),188,String(k),'middle',ink,13);
    }
    label(s,55,24,tr('Resto della decifrazione','Decryption remainder'),'start'); label(s,520,214,tr('Esponente d','Exponent d'),'end');
    return tr(`d = ${d} · 3d = ${raw} · Resto ${rem}. ${rem===2?'Messaggio 2 ritrovato.':'Il messaggio inviato era 2.'}`,
      `d = ${d} · 3d = ${raw} · Remainder ${rem}. ${rem===2?'Message 2 recovered.':'The message sent was 2.'}`);
  }
  function reflectionChart(s, hundredths) {
    const gap=hundredths/100;
    const X=value=>60+440*value;
    const center=X(.5), first=X(.5-gap), second=X(.5+gap);
    line(s,60,150,500,150,ink);
    for (const x of [0,.25,.5,.75,1]) {
      line(s,X(x),148,X(x),155,ink);
      label(s,X(x),177,num(x));
    }
    line(s,center,27,center,147,orange,{'stroke-dasharray':'4 4'});
    line(s,first,94,second,94,green,{'stroke-width':2});
    for (const x of [first,second]) circle(s,x,94,7,green);
    path(s,[[center,90],[center+4,94],[center,98],[center-4,94],[center,90]],orange,1.5,'var(--panel)');
    label(s,center,20,tr('Retta di mezzo','Middle line'));
    label(s,center,213,tr('Posizione orizzontale','Horizontal position'));
    return tr(`Posizioni ${num(.5-gap)} e ${num(.5+gap)} · Punto medio ${num(.5)} · Distanza ${num(2*gap)}.`,
      `Positions ${num(.5-gap)} and ${num(.5+gap)} · Midpoint ${num(.5)} · Distance ${num(2*gap)}.`);
  }
  const renderers={1:primeChart,5:orbitChart,7:keys,9:windows,10:reflectionChart};
  const prepared=new WeakSet();
  function init(){
    for(const host of document.querySelectorAll('[data-essay-experiment]')){
      if(prepared.has(host))continue;
      prepared.add(host);
      const figure=Number(host.dataset.essayExperiment);
      const slider=host.querySelector('input'),svg=host.querySelector('svg'),output=host.querySelector('output');
      const presets=host.querySelectorAll('button[data-value]');
      const primeData=figure===1?{count:JSON.parse(host.dataset.count),est:JSON.parse(host.dataset.estimate)}:null;
      function update(){
        const value=Number(slider.value);
        svg.replaceChildren();
        const message=renderers[figure](svg,value,primeData);
        svg.setAttribute('aria-label',message);
        svg.removeAttribute('aria-hidden');
        output.textContent=message;
        slider.setAttribute('aria-valuetext',figure===10?num(value/100):String(value));
        for(const button of presets)button.setAttribute('aria-pressed',String(value===Number(button.dataset.value)));
      }
      slider.addEventListener('input',update);
      for(const button of presets)button.addEventListener('click',()=>{slider.value=button.dataset.value;update();});
      update();
      host.hidden=false;
    }
  }
  init();
  window.addEventListener('mdc:content-change',init);
})();
