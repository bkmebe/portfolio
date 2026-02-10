// Particle canvas background
(function(){
  const canvas = document.createElement('canvas');
  canvas.id = 'bgParticles';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.zIndex = '-3';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let w, h, particles=[];

  function resize(){
    w = canvas.width = innerWidth; h = canvas.height = innerHeight;
  }
  addEventListener('resize', resize);
  resize();

  function rand(min,max){return Math.random()*(max-min)+min}
  function createParticles(n){
    particles = [];
    for(let i=0;i<n;i++){
      particles.push({x:rand(0,w), y:rand(0,h), r:rand(0.8,3), vx:rand(-0.2,0.2), vy:rand(-0.1,0.1), hue:rand(160,280)});
    }
  }
  createParticles(Math.round((w*h)/12000));

  function tick(){
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x < -20) p.x = w+20; if(p.x> w+20) p.x=-20;
      if(p.y < -20) p.y = h+20; if(p.y > h+20) p.y=-20;
      ctx.beginPath();
      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
      g.addColorStop(0, `hsla(${p.hue},80%,64%,0.14)`);
      g.addColorStop(1, `hsla(${p.hue},80%,64%,0)`);
      ctx.fillStyle = g;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
  addEventListener('resize', ()=> createParticles(Math.round((innerWidth*innerHeight)/12000)));
})();

// Navigation toggle
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
if(navToggle && siteNav){
  navToggle.addEventListener('click', ()=>{ const exp = navToggle.getAttribute('aria-expanded') === 'true'; navToggle.setAttribute('aria-expanded', String(!exp)); siteNav.classList.toggle('open'); });
  siteNav.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{ siteNav.classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); }));
}

// Reveal on scroll
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!prefersReduced){
  const io = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in-view'); }); }, {threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=> io.observe(el));
} else { document.querySelectorAll('.reveal').forEach(el=> el.classList.add('in-view')); }

// Modal
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalClose = document.getElementById('modalClose');
let lastFocus = null;
function openModal(title, desc){ lastFocus = document.activeElement; modalTitle.textContent = title; if(desc) modalDesc.innerHTML = String(desc).replace(/\n/g, '<br>'); else modalDesc.textContent = ''; modal.setAttribute('aria-hidden','false'); modalClose.focus(); document.addEventListener('keydown', trap); }
function closeModal(){ modal.setAttribute('aria-hidden','true'); document.removeEventListener('keydown', trap); lastFocus && lastFocus.focus(); }
function trap(e){ if(e.key === 'Escape') closeModal(); if(e.key === 'Tab'){ const nodes = modal.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'); const first = nodes[0]; const last = nodes[nodes.length-1]; if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); } if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); } } }

document.querySelectorAll('.project-card').forEach(card=>{ card.addEventListener('click', ()=>{ openModal(card.dataset.title || card.querySelector('h3')?.textContent || '', card.dataset.desc || ''); }); });
modalClose?.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });

// Tilt effect for cards and photo
function attachTilt(el, intensity=12){ el.addEventListener('mousemove', (ev)=>{
  const r = el.getBoundingClientRect();
  const px = (ev.clientX - r.left) / r.width - 0.5;
  const py = (ev.clientY - r.top) / r.height - 0.5;
  const rotX = (py * intensity).toFixed(2);
  const rotY = (px * -intensity).toFixed(2);
  el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
});
 el.addEventListener('mouseleave', ()=>{ el.style.transform = ''; });
}
document.querySelectorAll('.project-card').forEach(el=> attachTilt(el,10));
const photo = document.querySelector('.photo-frame'); if(photo) attachTilt(photo,8);

// Footer year
const yearEl = document.getElementById('year'); if(yearEl) yearEl.textContent = new Date().getFullYear();

// Contact form handler (EmailJS integration)
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

// Configure these with your EmailJS account values (or leave as placeholders to use fallback)
const EMAILJS_USER = 'eVx-kgN8c2ls_X3JV';
const EMAILJS_SERVICE = 'service_aiucnvb';
const EMAILJS_TEMPLATE = 'template_slafu7f';

// Initialize EmailJS if SDK is loaded and a user ID is set
try{ if(window.emailjs && EMAILJS_USER && EMAILJS_USER !== 'YOUR_EMAILJS_USER_ID'){ emailjs.init(EMAILJS_USER); } }catch(e){ console.warn('EmailJS init skipped', e); }

if(contactForm){
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    formMsg.textContent = 'Sending...';

    const params = {
      name: contactForm.name?.value || '',
      email: contactForm.email?.value || '',
      message: contactForm.message?.value || ''
    };

    // If EmailJS is configured, send using EmailJS, otherwise fallback to local success message
    if(window.emailjs && EMAILJS_USER !== 'YOUR_EMAILJS_USER_ID' && EMAILJS_SERVICE && EMAILJS_TEMPLATE){
      // helper: escape text for safe insertion
      function escapeHtml(s){
        return String(s)
          .replace(/&/g,'&amp;')
          .replace(/</g,'&lt;')
          .replace(/>/g,'&gt;')
          .replace(/"/g,'&quot;')
          .replace(/'/g,'&#39;');
      }

      emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, params)
        .then(()=>{
          formMsg.textContent = 'Message sent — you will receive it by email shortly.';
          contactForm.reset();
          setTimeout(()=> formMsg.textContent = '', 6000);
        })
        .catch(err=>{
          console.error('EmailJS error', err);
          // show a more helpful error message on the page
          let detail = '';
          try{ detail = err && (err.text || err.message || JSON.stringify(err)); }catch(e){ detail = String(err); }
          formMsg.innerHTML = 'Sending failed — try again or contact directly via email.<br><small>' + escapeHtml(detail) + '</small>';
        });
    } else {
      // Fallback client-side behavior (no email delivery)
      const name = params.name || 'there';
      formMsg.textContent = `Thanks, ${name}! I'll get back to you.`;
      contactForm.reset();
      setTimeout(()=> formMsg.textContent = '', 6000);
    }
  });
}

// Copy-to-clipboard for contact cards
document.querySelectorAll('.copy-btn').forEach(btn=>{
  btn.addEventListener('click', async (e)=>{
    const text = btn.dataset.copy || '';
    try{
      await navigator.clipboard.writeText(text);
      btn.classList.add('copied');
      const prev = btn.textContent;
      btn.textContent = 'Copied';
      console.log('contact: copied', text);
      setTimeout(()=>{ btn.classList.remove('copied'); btn.textContent = prev; }, 2000);
    }catch(err){
      console.error('copy failed', err);
      window.prompt('Copy the text below:', text);
    }
  });
});

// Animate contact cards on scroll with a small stagger
try{
  const contactCards = Array.from(document.querySelectorAll('.contact-card'));
  if(contactCards.length && !prefersReduced){
    const cIO = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const idx = contactCards.indexOf(entry.target);
          const delay = (idx >= 0 ? idx : 0) * 80;
          setTimeout(()=>{ entry.target.classList.add('in-view','pop-anim'); }, delay);
          cIO.unobserve(entry.target);
        }
      });
    }, {threshold:0.08});
    contactCards.forEach(c=> cIO.observe(c));
  } else {
    document.querySelectorAll('.contact-card').forEach(c=> c.classList.add('in-view'));
  }
  // gentle tilt for cards
  document.querySelectorAll('.contact-card').forEach(el=> attachTilt(el,4));
} catch(err){ console.error('contact card animation error', err); }

// Order CTA behavior: smooth scroll then open link (for tel/mailto)
document.querySelectorAll('.order-cta, .btn.btn-primary, #orderNowFloat').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const href = btn.getAttribute('href') || '';
    const contact = document.getElementById('contact');
    if(contact){ contact.scrollIntoView({behavior:'smooth'}); }
    console.log('CTA clicked', href);
    // if external (tel/mailto) open after a short delay so user sees the scroll
    if(href && !href.startsWith('#')){
      e.preventDefault();
      setTimeout(()=>{ window.location.href = href; }, 600);
    }
    setTimeout(()=> document.getElementById('name')?.focus(), 800);
  });
});

// Order Now button behavior: scroll to contact and prefill message
const orderBtn = document.getElementById('orderNowBtn');
function openContactWithPrefill(prefill){
  const contact = document.getElementById('contact');
  const msg = document.getElementById('message');
  if(contact){ contact.scrollIntoView({behavior:'smooth', block:'start'}); }
  if(msg && prefill){ msg.value = prefill; msg.focus(); }
}
if(orderBtn){ orderBtn.addEventListener('click', (e)=>{ e.preventDefault(); openContactWithPrefill("Hello Biruk — I'm interested in placing an order. Please get back to me with availability and pricing."); }); }

// keyboard accessibility for project cards
document.querySelectorAll('.project-card').forEach(card=>{ card.setAttribute('tabindex','0'); card.addEventListener('keydown',(e)=>{ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); card.click(); } }); });

// small parallax on scroll for photo
window.addEventListener('scroll', ()=>{ const hero = document.querySelector('.hero'); const photo = document.querySelector('.photo-frame'); if(!hero || !photo) return; const rect = hero.getBoundingClientRect(); const pct = Math.min(Math.max((rect.top / window.innerHeight) * -1, 0), 1); photo.style.transform = `translateY(${pct * -12}px)`; });

