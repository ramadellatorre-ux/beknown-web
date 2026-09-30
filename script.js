const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 2) Shader del anillo en Modalidades (WebGL) */
(function ringShader(){
  const canvas=document.getElementById('pricing-shader');
  if(!canvas) return;
  const gl=canvas.getContext('webgl');
  if(!gl){ canvas.style.display='none'; return; }
  const vs=`attribute vec2 aPosition; void main(){ gl_Position = vec4(aPosition,0.,1.); }`;
  const fs=`precision highp float;
    uniform float iTime; uniform vec2 iResolution; uniform vec3 uBg;
    mat2 rot(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
    float varia(vec2 a,vec2 b,float st,float sp){ return sin(dot(normalize(a),normalize(b))*st+iTime*sp)/100.; }
    float ring(vec2 uv,vec2 c,float rad,float w){ vec2 d=c-uv; float l=length(d);
      l+=varia(d,vec2(0.,1.),5.,2.); l-=varia(d,vec2(1.,0.),5.,2.);
      return smoothstep(rad-w,rad,l)-smoothstep(rad,rad+w,l); }
    void main(){
      vec2 uv=gl_FragCoord.xy/iResolution.xy; float ar=iResolution.x/iResolution.y;
      uv.x*=ar; uv.x-=(ar-1.)*.5;
      float rad=.34; vec2 c=vec2(.5);
      float mask=ring(uv,c,rad,.035)+ring(uv,c,rad-.018,.01)+ring(uv,c,rad+.018,.005);
      vec2 v=rot(iTime)*(uv-c);
      // anillo en latón con reflejos bordo
      vec3 fg=vec3(.62+v.x*.35, .38+v.y*.22, .16-v.y*v.x*.6);
      vec3 col=mix(uBg,fg,clamp(mask,0.,1.));
      col=mix(col,vec3(1.,.9,.74),ring(uv,c,rad,.003));
      gl_FragColor=vec4(col,1.);
    }`;
  function sh(t,src){ const s=gl.createShader(t); gl.shaderSource(s,src); gl.compileShader(s); return s; }
  const p=gl.createProgram(); gl.attachShader(p,sh(gl.VERTEX_SHADER,vs)); gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs)); gl.linkProgram(p);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS)){ canvas.style.display='none'; return; }
  gl.useProgram(p);
  const b=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,b);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const a=gl.getAttribLocation(p,'aPosition'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
  const uT=gl.getUniformLocation(p,'iTime'), uR=gl.getUniformLocation(p,'iResolution'), uBg=gl.getUniformLocation(p,'uBg');
  gl.uniform3f(uBg,18/255,8/255,7/255);
  function resize(){ const dpr=Math.min(window.devicePixelRatio||1,1.5); canvas.width=canvas.clientWidth*dpr; canvas.height=canvas.clientHeight*dpr; gl.viewport(0,0,canvas.width,canvas.height); }
  resize(); window.addEventListener('resize',resize);
  let running=false;
  function draw(t){ gl.uniform1f(uT,t*.001); gl.uniform2f(uR,canvas.width,canvas.height); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); }
  function loop(t){ if(!running) return; draw(t); requestAnimationFrame(loop); }
  if(reduceMotion){ draw(3000); return; }
  new IntersectionObserver(([e])=>{ const was=running; running=e.isIntersecting; if(running && !was) requestAnimationFrame(loop); }).observe(canvas);
})();

/* 2.5) Servicios: índice + panel (hover, click y flechas del teclado) */
(function servicios(){
  const root=document.querySelector('.svc'); if(!root) return;
  const tabs=[...root.querySelectorAll('.svc__item')];
  const panels=[...root.querySelectorAll('.svc__panel')];
  if(!tabs.length || tabs.length!==panels.length) return;
  let activo=0;
  function activar(i, foco){
    if(i===activo && !foco) return;
    activo=i;
    tabs.forEach((t,n)=>{ const on=n===i; t.classList.toggle('is-on',on); t.setAttribute('aria-selected',on); t.tabIndex=on?0:-1; });
    panels.forEach((p,n)=>p.classList.toggle('is-on',n===i));
    if(foco) tabs[i].focus();
  }
  tabs.forEach((t,i)=>{
    t.addEventListener('mouseenter',()=>activar(i));
    t.addEventListener('click',()=>activar(i));
    t.addEventListener('focus',()=>activar(i));
    t.addEventListener('keydown',e=>{
      let n=null;
      if(e.key==='ArrowDown'||e.key==='ArrowRight') n=(i+1)%tabs.length;
      else if(e.key==='ArrowUp'||e.key==='ArrowLeft') n=(i-1+tabs.length)%tabs.length;
      else if(e.key==='Home') n=0;
      else if(e.key==='End') n=tabs.length-1;
      if(n!==null){ e.preventDefault(); activar(n,true); }
    });
  });
})();

/* 3) Nav sticky + menú mobile + CTA flotante */
const nav=document.getElementById('nav'), burger=document.getElementById('burger'), links=document.getElementById('navlinks'), sticky=document.getElementById('stickyCta');
const hero=document.querySelector('.hero'), aplicar=document.getElementById('aplicar');
function onScroll(){
  nav.classList.toggle('is-stuck', window.scrollY>40);
  const pastHero = window.scrollY > hero.offsetHeight*0.8;
  const r = aplicar.getBoundingClientRect();
  const inApply = r.top < window.innerHeight && r.bottom > 0;
  sticky.classList.toggle('show', pastHero && !inApply);
}
window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
burger.addEventListener('click',()=>{ const open=links.classList.toggle('open'); burger.setAttribute('aria-expanded',open); burger.setAttribute('aria-label', open?'Cerrar menú':'Abrir menú'); });
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ links.classList.remove('open'); burger.setAttribute('aria-expanded','false'); burger.setAttribute('aria-label','Abrir menú'); }));

/* 4) Entradas: hero al cargar + reveal al scroll */
window.addEventListener('load',()=>{ document.querySelectorAll('.hero [data-anim]').forEach((el,i)=>setTimeout(()=>el.classList.add('in'), 120+i*140)); });
setTimeout(()=>document.querySelectorAll('.hero [data-anim]').forEach(el=>el.classList.add('in')), 1800);
const io=new IntersectionObserver(entries=>entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* 4.1) Problema: la línea baja con el scroll, enciende cada dolor y al final gira como la flecha */
(function problema(){
  const box=document.getElementById('pains'); if(!box) return;
  const items=[...box.querySelectorAll('.pain')];
  function fin(){ items.forEach(li=>li.classList.add('on')); box.style.setProperty('--p',1); box.classList.add('is-done'); }
  if(reduceMotion){ fin(); return; }
  const track=box.querySelector('.pains__track');
  let pendiente=false;
  function pintar(){
    pendiente=false;
    const vh=window.innerHeight, r=track.getBoundingClientRect();
    // la punta de la línea sigue a un punto fijo de la pantalla (62% de alto)
    const p=Math.min(1, Math.max(0, (vh*.62 - r.top) / r.height));
    box.style.setProperty('--p', p.toFixed(3));
    items.forEach(li=>{
      const dot=li.querySelector('.pain__dot').getBoundingClientRect();
      li.classList.toggle('on', dot.top + dot.height/2 <= r.top + p*r.height + 1);
    });
    box.classList.toggle('is-done', p>=.995);
  }
  function pedir(){ if(!pendiente){ pendiente=true; requestAnimationFrame(pintar); } }
  window.addEventListener('scroll', pedir, {passive:true});
  window.addEventListener('resize', pedir);
  pintar();
})();

/* 4.2) Manifiesto: cada idea se enciende palabra por palabra según el scroll */
(function manifiesto(){
  const items=[...document.querySelectorAll('.mani')];
  if(!items.length) return;
  if(reduceMotion){ items.forEach(m=>m.classList.add('is-done')); return; }
  // envuelve cada palabra en <span class="w">, respetando los <em>
  function envolver(nodo){
    [...nodo.childNodes].forEach(n=>{
      if(n.nodeType===3){
        const frag=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t=>{
          if(!t) return;
          if(/^\s+$/.test(t)){ frag.appendChild(document.createTextNode(t)); return; }
          const w=document.createElement('span'); w.className='w'; w.textContent=t; frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if(n.nodeType===1) envolver(n);
    });
  }
  const datos=items.map(m=>{ const p=m.querySelector('.mani__text'); envolver(p); return { m, p, ws:[...p.querySelectorAll('.w')] }; });
  let pendiente=false;
  function pintar(){
    pendiente=false;
    const vh=window.innerHeight;
    datos.forEach(({m,p,ws})=>{
      const r=p.getBoundingClientRect();
      // arranca cuando el texto entra por abajo y termina antes de llegar a la mitad de la pantalla
      const prog=Math.min(1, Math.max(0, (vh*.88 - r.top) / (r.height + vh*.38)));
      const n=Math.round(prog*ws.length);
      ws.forEach((w,i)=>w.classList.toggle('on', i<n));
      m.classList.toggle('is-done', n===ws.length);
    });
  }
  function pedir(){ if(!pendiente){ pendiente=true; requestAnimationFrame(pintar); } }
  window.addEventListener('scroll', pedir, {passive:true});
  window.addEventListener('resize', pedir);
  pintar();
})();

/* 4.5) Halo que sigue al cursor, con inercia */
(function halo(){
  const el=document.getElementById('glow'); if(!el) return;
  // sin mouse fino o con movimiento reducido no tiene sentido: lo sacamos del DOM
  if(reduceMotion || !window.matchMedia('(hover:hover) and (pointer:fine)').matches){ el.remove(); return; }
  const OSCURAS='.verdad, .precios, .manifiesto, .contacto, .cierre, .footer';
  let destX=innerWidth/2, destY=innerHeight/2, x=destX, y=destY, raf=null, visible=false;
  function pintar(){
    x += (destX-x)*0.11; y += (destY-y)*0.11;
    el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)';
    raf = (Math.abs(destX-x)>0.4 || Math.abs(destY-y)>0.4) ? requestAnimationFrame(pintar) : null;
  }
  function mover(e){
    destX=e.clientX; destY=e.clientY;
    if(!visible){ visible=true; el.style.transform='translate3d('+destX+'px,'+destY+'px,0)'; x=destX; y=destY; el.classList.add('on'); }
    const t=e.target;
    el.classList.toggle('dark', !!(t && t.closest && t.closest(OSCURAS)));
    if(!raf) raf=requestAnimationFrame(pintar);
  }
  window.addEventListener('mousemove', mover, {passive:true});
  document.addEventListener('mouseleave', function(){ visible=false; el.classList.remove('on'); });
})();

/* 5) Formulario de aplicación → luego agenda */
async function enviarAplicacion(data){
  // CONECTAR ACÁ: enviar `data` al CRM (Notion/Airtable/webhook de n8n/Make).
  // Ejemplo: await fetch('[URL_WEBHOOK]', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
  return true;
}
/* Agenda de Calendly: se carga recién después de aplicar, con el nombre precargado */
function abrirAgenda(nombre){
  const box=document.getElementById('agenda');
  if(box.classList.contains('is-open')) return;
  const q=new URLSearchParams({
    embed_domain: location.host || 'localhost', embed_type:'Inline', hide_gdpr_banner:'1',
    // colores de marca (Calendly los aplica solo en planes pagos; en el gratuito se ignoran)
    primary_color:'7f0000', background_color:'fffcf7', text_color:'1e1512'
  });
  if(nombre) q.set('name', nombre);
  const f=document.createElement('iframe');
  f.src=box.dataset.calendly + '?' + q.toString();
  f.title='Elegí un horario para la llamada estratégica';
  box.replaceChildren(f);
  box.classList.add('is-open');
}
// Calendly avisa por postMessage cuando se confirma la reserva
window.addEventListener('message', e=>{
  if(e.origin!=='https://calendly.com' || !e.data || e.data.event!=='calendly.event_scheduled') return;
  status.className='form__status'; status.textContent='¡Listo! Tu llamada quedó agendada. Te llegó la confirmación por mail.';
});

const form=document.getElementById('applyForm'), status=document.getElementById('formStatus');
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const req=[...form.querySelectorAll('[required]')];
  const empty=req.find(el=>!el.value.trim());
  if(empty){ status.className='form__status err'; status.textContent='Completá todos los campos para enviar la aplicación.'; empty.focus(); return; }
  const data=Object.fromEntries(new FormData(form).entries());
  try{
    await enviarAplicacion(data);
    status.className='form__status'; status.textContent='Aplicación enviada. Ahora elegí un horario en la agenda.';
    abrirAgenda(data.nombre);
    document.getElementById('agenda').scrollIntoView({behavior: reduceMotion?'auto':'smooth', block:'start'});
  }catch(err){
    status.className='form__status err'; status.textContent='No se pudo enviar. Probá de nuevo en unos minutos.';
  }
});

document.getElementById('year').textContent=new Date().getFullYear();
