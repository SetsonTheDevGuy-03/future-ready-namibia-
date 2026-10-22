(()=>{'use strict';
const $=(q,root=document)=>root.querySelector(q),$$=(q,root=document)=>Array.from(root.querySelectorAll(q));
const safeStorage={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{}},remove(k){try{localStorage.removeItem(k)}catch{}}};
const body=document.body;const theme=safeStorage.get('fr-theme');if(theme==='dark')body.classList.add('dark');
$$('[data-theme]').forEach(btn=>{btn.setAttribute('aria-label','Toggle dark mode');btn.addEventListener('click',()=>{body.classList.toggle('dark');safeStorage.set('fr-theme',body.classList.contains('dark')?'dark':'light')})});
const menu=$('#main-nav'),toggle=$('[data-menu]');if(toggle&&menu){toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});$$('a',menu).forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false')}})}
const up=$('[data-top]');const progress=$('[data-reading-progress]');const onScroll=()=>{if(up)up.classList.toggle('show',scrollY>450);if(progress){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?Math.min(100,scrollY/max*100):0)+'%'}};window.addEventListener('scroll',onScroll,{passive:true});onScroll();if(up)up.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}})},{threshold:.06});$$('.fade').forEach(e=>observer.observe(e))}else{$$('.fade').forEach(e=>e.classList.add('visible'))}
const search=$('#article-search'),cards=$$('[data-post-card]'),filterBtns=$$('[data-filter]');let category='All';function updatePosts(){const term=(search?.value||'').trim().toLowerCase();let shown=0;cards.forEach(c=>{const match=(category==='All'||c.dataset.category===category)&&c.textContent.toLowerCase().includes(term);c.hidden=!match;c.style.display=match?'':'none';if(match)shown++});const count=$('#post-count');if(count)count.textContent=`Showing ${shown} of ${cards.length} articles`;const empty=$('#post-empty');if(empty)empty.style.display=shown?'none':'block'}if(search)search.addEventListener('input',updatePosts);filterBtns.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;filterBtns.forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});updatePosts()}));if(cards.length)updatePosts();
$$('audio').forEach(a=>a.addEventListener('play',()=>{$$('audio').forEach(other=>{if(other!==a&&!other.paused)other.pause()})}));
$$('[data-share]').forEach(btn=>btn.addEventListener('click',async()=>{const label=btn.textContent;try{if(navigator.share){await navigator.share({title:document.title,url:location.href});return}if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(location.href);btn.textContent='Link copied!'}else{prompt('Copy this link:',location.href)}setTimeout(()=>btn.textContent=label,1800)}catch(e){if(e.name!=='AbortError')prompt('Copy this link:',location.href)}}));
$$('[data-check-id]').forEach(c=>{const key='fr-article-'+c.dataset.checkId;c.checked=safeStorage.get(key)==='true';c.addEventListener('change',()=>safeStorage.set(key,String(c.checked)))});
const planner=$('[data-planner]');if(planner){const boxes=$$('input[type="checkbox"]',planner),bar=$('#plan-progress'),count=$('#plan-count');function updatePlan(){let n=0;boxes.forEach((b,i)=>{const k='fr-plan-'+i;if(b.checked)n++;safeStorage.set(k,String(b.checked))});if(bar)bar.style.width=(n/boxes.length*100)+'%';if(count)count.textContent=n+' of '+boxes.length+' steps completed'}boxes.forEach((b,i)=>{b.checked=safeStorage.get('fr-plan-'+i)==='true';b.addEventListener('change',updatePlan)});updatePlan();$('#plan-reset')?.addEventListener('click',()=>{if(!confirm('Reset your 30-day progress?'))return;boxes.forEach(b=>b.checked=false);updatePlan()})}
const quiz=$('#safety-quiz');if(quiz){$('#quiz-check')?.addEventListener('click',()=>{const questions=$$('.quiz-question',quiz);let score=0,answered=0;questions.forEach((q,i)=>{const chosen=$(`input[name="q${i}"]:checked`,q);if(chosen){answered++;if(chosen.value===q.dataset.answer)score++}});const feedback=$('#quiz-feedback');feedback.classList.add('show');feedback.textContent=answered<questions.length?`You answered ${answered} of ${questions.length} questions. Please answer every question to receive your result.`:`You scored ${score} out of ${questions.length}. ${score===questions.length?'Excellent! Keep independently verifying employers and payment requirements.':'Review the safety guide and repeat the quiz. Never send passwords, OTPs or upfront job payments.'}`;feedback.setAttribute('role','status');feedback.scrollIntoView({behavior:'smooth',block:'nearest'})});$('#quiz-reset')?.addEventListener('click',()=>{quiz.reset();const feedback=$('#quiz-feedback');feedback.classList.remove('show');feedback.textContent=''})}
const cvFields=$$('[data-cv-field]');if(cvFields.length){function updateCV(){cvFields.forEach(f=>{const preview=$(`[data-cv-preview="${f.dataset.cvField}"]`);if(preview)preview.textContent=f.value.trim()||preview.dataset.placeholder||'—'})}cvFields.forEach(f=>f.addEventListener('input',updateCV));updateCV();$('#cv-print')?.addEventListener('click',()=>window.print());$('#cv-clear')?.addEventListener('click',()=>{cvFields.forEach(f=>f.value='');updateCV()})}
})();


/* FUTUREREADY REAL PHOTOGRAPHY — responsible stock photo upgrade.
   Photographs are illustrative, not of actual Namibian students or group members.
   Gracefully restores the original local artwork when images cannot be reached. */
(()=>{
  const photographs=[["1521737711867-e3b97375f902","People collaborating at work — illustrative stock photograph"],["1500534623283-312aade485b7","Landscape illustrating geographical distance and access challenges"],["1516321318423-f06f85e504b3","People using digital technology — illustrative stock photograph"],["1498050108023-c5249f4df085","Computer and workspace illustrating digital freelancing"],["1486312338219-ce68d2c6f44d","Laptop workspace illustrating remote work"],["1434030216411-0b793f4b4173","Study materials illustrating free online learning"],["1455390582262-044cdead277a","Person writing and preparing career documents"],["1518770660439-4636190af475","Computer technology illustrating internet safety"],["1556761175-b413da4baf72","People in a business meeting — illustrative stock photograph"],["1517245386807-bb43f82c33c4","People working together on a project — illustrative stock photograph"]];
  const prefix="https://images.unsplash.com/photo-";
  function enhance(){
    document.querySelectorAll("img").forEach(img=>{
      const original=img.getAttribute("src")||"";
      let chosen=null;
      const match=original.match(/(?:^|\/)editorial-(\d{2})\.svg$/);
      if(match){chosen=photographs[Number(match[1])-1]}
      else if(/(?:^|\/)hero-journey\.svg$/.test(original)){
        chosen=["1522202176988-66273c2fd55f","Students studying and collaborating — illustrative stock photograph"];
      }
      if(!chosen)return;
      const originalAlt=img.alt;
      img.classList.add("stock-photo");
      img.decoding="async";
      if(!img.loading&&!original.includes("hero-journey"))img.loading="lazy";
      img.onerror=()=>{
        img.onerror=null;
        img.classList.remove("stock-photo");
        img.src=original;
        img.alt=originalAlt;
      };
      img.alt=chosen[1];
      img.src=prefix+chosen[0]+"?auto=format&fit=crop&w=1200&q=82";
    });
    document.querySelectorAll("img[data-photo-fallback]").forEach(img=>{
      img.onerror=()=>{img.onerror=null;img.src=img.getAttribute("data-photo-fallback")};
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",enhance,{once:true});else enhance();
})();
