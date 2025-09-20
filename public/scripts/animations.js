// Lightweight animation & UX enhancements
(function(){
  const nav = document.querySelector('.navbar');
  function onScrollNav(){
    const scrolled = window.scrollY > 100;
    if(!nav) return;
    nav.style.background = scrolled ? 'rgba(15,23,42,0.98)' : 'rgba(15,23,42,0.95)';
    nav.style.boxShadow = scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none';
  }
  window.addEventListener('scroll', onScrollNav, { passive:true });
  onScrollNav();

  // Smooth scroll for internal anchors
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    const id = a.getAttribute('href');
    if(id.length > 1){
      const el = document.querySelector(id);
      if(el){
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  });

  // Active nav highlight
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  function highlight(){
    const scrollPos = window.scrollY + 120;
    let current = '';
    for(const s of sections){
      if(scrollPos >= s.offsetTop && scrollPos < s.offsetTop + s.offsetHeight){
        current = s.id; break;
      }
    }
    navLinks.forEach(l => {
      const href = l.getAttribute('href');
      if(href === `#${current}`) l.classList.add('active'); else l.classList.remove('active');
    });
  }
  window.addEventListener('scroll', highlight, { passive:true });
  highlight();

  // IntersectionObserver for fade ups
  const animated = document.querySelectorAll('.anim-fade-up');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('anim-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    animated.forEach(el => io.observe(el));
  } else {
    animated.forEach(el => el.classList.add('anim-in'));
  }
})();

// (Pruned) Removed metric count-up & subsection highlight for minimal About.

// Terminal typing effect (improved)
(function(){
  const terminal = document.querySelector('[data-terminal]');
  if(!terminal) return;
  const lines = Array.from(terminal.querySelectorAll('.terminal-line'));
  const cursor = terminal.querySelector('.terminal-cursor');
  let started = false;

  // Inline cursor helpers
  function attachCursor(lineEl){
    if(!cursor) return;
    if(cursor.parentElement !== lineEl){
      lineEl.appendChild(cursor);
    }
    cursor.style.display = 'inline-block';
  }
  function hideCursor(){ if(cursor) cursor.style.display = 'none'; }

  function typeCommand(lineEl, prompt, text, speed){
    return new Promise(resolve => {
      let i = 0;
      lineEl.classList.add('typing');
      function step(){
        // Build content with prompt + typed chars, then cursor
        lineEl.innerHTML = `<span class="prompt">${prompt}</span>` + text.slice(0, i);
        attachCursor(lineEl);
        if(i < text.length){
          i++;
          setTimeout(step, speed);
        } else {
          lineEl.classList.remove('typing');
          lineEl.classList.add('faded');
          // Leave cursor right after finished command briefly then hide
          setTimeout(()=>{ hideCursor(); resolve(); }, 120);
        }
      }
      step();
    });
  }

  function instantLine(lineEl, content){
    lineEl.textContent = content;
  }

  function simulateProgress(lineEl){
    return new Promise(resolve => {
      const base = lineEl.getAttribute('data-text');
      let dots = 0;
      lineEl.textContent = base;
      hideCursor();
      const interval = setInterval(()=>{
        dots = (dots + 1) % 4;
        lineEl.textContent = base + '.'.repeat(dots);
      }, 300);
      setTimeout(()=>{
        clearInterval(interval);
        lineEl.textContent = base + ' done (42ms)';
        resolve();
      }, 1800);
    });
  }

  async function run(){
    for(const line of lines){
      const type = line.getAttribute('data-type');
      const text = line.getAttribute('data-text') || '';
      const prompt = line.getAttribute('data-prompt') || '';
      // Reveal line only when it's about to be processed
      line.style.display = 'block';
      switch(type){
        case 'cmd':
          await typeCommand(line, prompt, text, 28);
          break;
        case 'progress':
          await simulateProgress(line);
          line.classList.add('faded');
          break;
        case 'out':
          instantLine(line, text);
          line.classList.add('faded');
          break;
        case 'success':
          instantLine(line, text);
          line.classList.add('faded');
          break;
        default:
          instantLine(line, text);
      }
    }
    hideCursor();
  }

  function start(){ if(started) return; started = true; run(); }

  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ start(); io.disconnect(); } });
    }, { threshold: 0.2 });
    io.observe(terminal);
  } else {
    start();
  }
})();
