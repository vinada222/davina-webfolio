    function initProjectSlider(trackId, prevId, nextId, projects){
      const track = document.getElementById(trackId);
      const prevBtn = document.getElementById(prevId);
      const nextBtn = document.getElementById(nextId);
      let current = 0;
      let cardEls = [];

      function buildCards(){
        projects.forEach((p, i) => {
          const card = document.createElement('div');
          card.className = 'proj-card';
          card.innerHTML = `
            <img class="proj-thumb" src="${p.img}" alt="${p.title}">
            <h4>${p.title.toUpperCase()}</h4>
            <p>${p.desc}</p>
            <span class="proj-view">👁 View</span>
          `;
          card.addEventListener('click', () => {
            if (i !== current){
              current = i;
              updatePositions();
            }
          });
          track.appendChild(card);
          cardEls.push(card);
        });
      }

      function updatePositions(){
        const step = Math.max(90, Math.min(150, track.clientWidth * 0.28));
        const half = projects.length / 2;

        cardEls.forEach((card, i) => {
          let offset = i - current;
          if (offset > half) offset -= projects.length;
          if (offset < -half) offset += projects.length;

          const abs = Math.abs(offset);
          const scale = 1 - Math.min(abs, 3) * 0.14;
          const translateX = offset * step;
          const rotateY = offset * -18;
          const opacity = abs > 2 ? 0 : (abs === 0 ? 1 : abs === 1 ? 0.6 : 0.28);
          const blur = abs === 0 ? 0 : abs === 1 ? 1.5 : 3;

          card.classList.toggle('is-center', offset === 0);
          card.style.transform = `translate(-50%, -50%) translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;
          card.style.opacity = opacity;
          card.style.filter = `blur(${blur}px)`;
          card.style.zIndex = 10 - abs;
          card.style.pointerEvents = abs > 2 ? 'none' : 'auto';
        });
      }

      function move(dir){
        current = (current + dir + projects.length) % projects.length;
        updatePositions();
      }

      prevBtn.addEventListener('click', () => move(-1));
      nextBtn.addEventListener('click', () => move(1));

      track.setAttribute('tabindex', '0');
      track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') move(1);
        if (e.key === 'ArrowLeft') move(-1);
      });

      let dragStartX = null;
      track.addEventListener('pointerdown', (e) => { dragStartX = e.clientX; });
      track.addEventListener('pointerup', (e) => {
        if (dragStartX === null) return;
        const delta = e.clientX - dragStartX;
        if (Math.abs(delta) > 40) move(delta < 0 ? 1 : -1);
        dragStartX = null;
      });
      track.addEventListener('pointercancel', () => { dragStartX = null; });

      window.addEventListener('resize', updatePositions);

      buildCards();
      updatePositions();
    }

    // IMAGE SLOTS: School Organization Works
    initProjectSlider('projectTrack', 'prevArrow', 'nextArrow', [
      { title: "Computer Students' Society (CSS)", desc: "School Organization multimedia works, creating publication materials, promotional content, merchandise, and visual assets. ", img: "/photos/CSS%20ORG.png" },
      { title: "Presentation Mockup", desc: "Elevating visual concepts into a cohesive, polished display.", img: "/photos/PlacidoPenitente.jpg" },
    ]);

    // IMAGE SLOTS: GD Internship Works
    initProjectSlider('projectTrack2', 'prevArrow2', 'nextArrow2', [
      { title: "Neosense Integrated Solutions", desc: "Design graphics focusing on advertisements for social media that the company specializes in cutting-edge security systems and advanced timekeeping solutions.", img: "/photos/Scene%201.png" },
      { title: "J.KOpi", desc: "Design for social media posts, carousels, and stories for a social media marketing agency, creating strong brand identity and advertising.", img: "/photos/JKopi%20Thumbnail.png" },
      { title: "Beauty Pout", desc: "Advertising graphics on launching their lip cosmetic products and creating special promos, tutorials, and photoshoots.", img: "/photos/BeautyPout.png" }
    ]);

    // IMAGE SLOTS: 3 best logos
    initProjectSlider('projectTrack3', 'prevArrow3', 'nextArrow3', [
      { title: "Gailcast", desc: "Beauty & Wellness E-Commerce Website", img: "/photos/Gailcast.png" },
      { title: "Computer Students' Society", desc: "Redesigned logo and brand identity (2025).", img: "/photos/CSSLOGOORG.jpg" },
      { title: "Good Buoy", desc: "Pinnacle Pioneer's Logo for their Proposed Research Project", img: "/photos/GoodB.png" }
    ]);

   
    const navLinks = document.querySelectorAll('nav a[data-target]');
    const navSections = ['home', 'projects', 'skills', 'contact']
      .map(id => document.getElementById(id))
      .filter(Boolean);

    function setActiveNav(id){
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.target === id);
      });
    }

    navLinks.forEach(link => {
      link.addEventListener('click', () => setActiveNav(link.dataset.target));
    });

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          setActiveNav(entry.target.id);
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    navSections.forEach(section => sectionObserver.observe(section));

    // Page loader: show for a minimum time so it's actually visible,
    // then fade out once the page (images, etc.) has finished loading
    (function initPageLoader(){
      const loaderEl = document.getElementById('pageLoader');
      if (!loaderEl) return;

      const minDisplayTime = 3000; // ms — always shown at least this long
      const shownAt = Date.now();

      function hideLoader(){
        const elapsed = Date.now() - shownAt;
        const wait = Math.max(0, minDisplayTime - elapsed);
        setTimeout(() => {
          loaderEl.classList.add('is-hidden');
          setTimeout(() => loaderEl.remove(), 550); // clean up after fade-out
        }, wait);
      }

      if (document.readyState === 'complete') {
        hideLoader();
      } else {
        window.addEventListener('load', hideLoader);
      }
    })();

    // Dark / light mode toggle
    // First .toggle-btn = moon icon (dark mode), second = sun icon (light mode)
    const modeToggles = document.querySelectorAll('.nav-toggles .toggle-btn');
    const darkToggle = modeToggles[0];
    const lightToggle = modeToggles[1];

    function applyTheme(mode){
      document.body.classList.toggle('light-mode', mode === 'light');
      if (darkToggle) darkToggle.classList.toggle('active', mode === 'dark');
      if (lightToggle) lightToggle.classList.toggle('active', mode === 'light');
      try { localStorage.setItem('portfolio-theme', mode); } catch (e) {}
    }

    if (darkToggle) darkToggle.addEventListener('click', () => applyTheme('dark'));
    if (lightToggle) lightToggle.addEventListener('click', () => applyTheme('light'));

    let savedTheme = 'dark';
    try { savedTheme = localStorage.getItem('portfolio-theme') || 'dark'; } catch (e) {}
    applyTheme(savedTheme);

    // On-scroll reveal animation: fade + slide up, staggered per group, plays once
    (function initScrollReveal(){
      const groups = document.querySelectorAll('[data-reveal-group]');
      const staggerStep = 180; // ms between each element in the same group

      const groupObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const group = entry.target;
          const items = group.querySelectorAll('.reveal');
          items.forEach((el, i) => {
            setTimeout(() => el.classList.add('in-view'), i * staggerStep);
          });
          obs.unobserve(group); // only once — never re-trigger on re-scroll
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

      groups.forEach(group => groupObserver.observe(group));
    })();

    const EDGE_SENSITIVITY = 0;
const COLOR_SENSITIVITY = EDGE_SENSITIVITY + 5;
const GLOW_INTENSITY = 1.6;

function getEdgeProximity(rect, x, y) {
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const dx = x - cx;
  const dy = y - cy;
  let kx = Infinity;
  let ky = Infinity;
  if (dx !== 0) kx = cx / Math.abs(dx);
  if (dy !== 0) ky = cy / Math.abs(dy);
  return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
}

function getCursorAngle(rect, x, y) {
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const dx = x - cx;
  const dy = y - cy;
  if (dx === 0 && dy === 0) return 0;
  let degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  if (degrees < 0) degrees += 360;
  return degrees;
}

document.querySelectorAll('.skill-card').forEach(item => {
  item.addEventListener('pointermove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const proximity = getEdgeProximity(rect, x, y) * 100;
    const angle = getCursorAngle(rect, x, y);

    const borderOpacity = Math.max(0, (proximity - COLOR_SENSITIVITY) / (100 - COLOR_SENSITIVITY));
    const glowOpacity = Math.min(1, Math.max(0, (proximity - EDGE_SENSITIVITY) / (100 - EDGE_SENSITIVITY)) * GLOW_INTENSITY);

    item.style.setProperty('--angle', `${angle}deg`);
    item.style.setProperty('--border-opacity', borderOpacity);
    item.style.setProperty('--glow-opacity', glowOpacity);
  });

  item.addEventListener('pointerleave', () => {
    item.style.setProperty('--border-opacity', 0);
    item.style.setProperty('--glow-opacity', 0);
  });
});

    