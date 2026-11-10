function renderProjectGrid(containerId, projects){
      const grid = document.getElementById(containerId);
      if (!grid) return;

      projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'proj-card';
        card.innerHTML = `
          <div class="proj-thumb-frame">
            <span class="corner corner-tl"></span>
            <span class="corner corner-tr"></span>
            <span class="corner corner-bl"></span>
            <span class="corner corner-br"></span>
            <img class="proj-thumb" src="${p.img}" alt="${p.title}">
          </div>
          <h4>${p.title.toUpperCase()}</h4>
          <p>${p.desc}</p>
        `;
        if (p.detail){
          card.setAttribute('role', 'button');
          card.setAttribute('tabindex', '0');
          card.addEventListener('click', () => openProjectDetail(p));
          card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' '){
              event.preventDefault();
              openProjectDetail(p);
            }
          });
        } else if (p.url){
          card.addEventListener('click', () => window.open(p.url, '_blank', 'noopener'));
        }
        grid.appendChild(card);
      });
    }

    function openProjectDetail(project){
      const existingDetail = document.getElementById('projectDetail');
      if (existingDetail) existingDetail.remove();

      const detail = document.createElement('div');
      detail.className = 'project-detail';
      detail.id = 'projectDetail';
      detail.setAttribute('role', 'dialog');
      detail.setAttribute('aria-modal', 'true');
      detail.setAttribute('aria-labelledby', 'projectDetailTitle');
      detail.innerHTML = `
        <div class="project-detail-backdrop" data-detail-close></div>
        <article class="project-detail-panel">
          <button class="project-detail-close" type="button" aria-label="Close project details" data-detail-close>&times;</button>
          <div class="project-detail-copy">
            <span class="panel-eyebrow">${project.detail.eyebrow}</span>
            <h2 id="projectDetailTitle">${project.title}</h2>
            <p>${project.detail.description}</p>
            <div class="project-detail-tags">
              ${project.detail.tags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
          </div>
          <div class="project-detail-gallery">
            ${project.detail.gallery.map(image => `
              <figure>
                <img src="${image.src}" alt="${image.alt}">
                <figcaption>${image.caption}</figcaption>
              </figure>
            `).join('')}
          </div>
        </article>
      `;

      document.body.appendChild(detail);
      document.body.classList.add('project-detail-open');
      detail.querySelector('[data-detail-close]').focus();

      const closeDetail = () => {
        detail.remove();
        document.body.classList.remove('project-detail-open');
      };
      detail.querySelectorAll('[data-detail-close]').forEach(button => {
        button.addEventListener('click', closeDetail);
      });
      detail.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeDetail();
      });
    }

    //School Organization Works
    renderProjectGrid('projectGrid', [
      {
        title: "Computer Students' Society (CSS)",
        desc: "School Organization multimedia works, creating publication materials, promotional content, merchandise, and visual assets. ",
        img: "./photos/CSSBooth25.png",
        detail: {
          eyebrow: "SCHOOL ORGANIZATION WORKS",
          description: "A collection of publication materials, promotional graphics, merchandise mockups, and visual assets created for the Computer Students' Society.",
          tags: ["Publication Design", "Merchandise", "Brand Assets"],
          gallery: [
            { src: "./photos/CSSBooth25.png", alt: "Computer Students' Society publication materials", caption: "Publication materials and promotional graphics" },
            { src: "./photos/CSSLOGOORG.jpg", alt: "Computer Students' Society logo", caption: "Organization logo and brand identity" },
            { src: "./photos/CSS.png", alt: "Computer Students' Society visual asset", caption: "Supporting visual asset" }
          ]
        }
      },
      { title: "Creative Compositing & Manipulation", desc: "Specializing in creative digital compositing, blending advanced photo manipulation techniques with stylized user-interface overlays to create high-impact, narrative-driven visual assets.", img: "./photos/MCC COLLAGE.png" },
    ]);

    // IMAGE SLOTS: GD Internship Works
    renderProjectGrid('projectGrid2', [
      { title: "Neosense Integrated Solutions", desc: "Design graphics focusing on advertisements for social media that the company specializes in cutting-edge security systems and advanced timekeeping solutions.", img: "./photos/Scene%201.png" },
      { title: "J.KOpi", desc: "Design for social media posts, carousels, and stories for a social media marketing agency, creating strong brand identity and advertising.", img: "./photos/JKopi%20Thumbnail.png" },
      { title: "Beauty Pout", desc: "Advertising graphics on launching their lip cosmetic products and creating special promos, tutorials, and photoshoots.", img: "./photos/BeautyPout.png" }
    ]);

    // IMAGE SLOTS: 3 best logos
    renderProjectGrid('projectGrid3', [
      { title: "Gailcast", desc: "Beauty & Wellness E-Commerce Website", img: "./photos/Gailcast.png" },
      { title: "Computer Students' Society", desc: "Redesigned logo and brand identity (2025).", img: "./photos/CSSLOGOORG.jpg" }
    ]);

   
    const navLinks = document.querySelectorAll('nav a[data-target]');
    const sectionLinks = document.querySelectorAll('a[data-target]');
    const navSections = ['home', 'projects', 'certifications', 'skills', 'contact']
      .map(id => document.getElementById(id))
      .filter(Boolean);
    const root = document.documentElement;
    const originalScrollBehavior = root.style.scrollBehavior;
    let scrollAnimationFrame = null;

    function setActiveNav(id){
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.target === id);
      });
    }

    function focusSection(target){
      if (!target.hasAttribute('tabindex')){
        target.setAttribute('tabindex', '-1');
      }
      target.focus({ preventScroll: true });
    }

    function scrollToSection(target, onComplete){
      if (scrollAnimationFrame !== null){
        cancelAnimationFrame(scrollAnimationFrame);
        scrollAnimationFrame = null;
      }

      const destination = destinationFor(target);
      root.style.scrollBehavior = 'auto';
      const start = window.scrollY;
      const distance = destination - start;

      if (Math.abs(distance) < 1){
        root.style.scrollBehavior = originalScrollBehavior;
        onComplete();
        return;
      }

      const duration = Math.min(1100, Math.max(500, Math.abs(distance) * 0.35));
      const startedAt = performance.now();

      function animateScroll(now){
        const progress = Math.min((now - startedAt) / duration, 1);
        const easedProgress = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, start + distance * easedProgress);

        if (progress < 1){
          scrollAnimationFrame = requestAnimationFrame(animateScroll);
        } else {
          scrollAnimationFrame = null;
          root.style.scrollBehavior = originalScrollBehavior;
          onComplete();
        }
      }

      scrollAnimationFrame = requestAnimationFrame(animateScroll);
    }

    function destinationFor(target){
      const marginTop = parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
      const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
      return Math.max(0, Math.min(
        maxScroll,
        target.getBoundingClientRect().top + window.scrollY - marginTop
      ));
    }

    sectionLinks.forEach(link => {
      link.addEventListener('click', event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const target = document.getElementById(link.dataset.target);
        if (!target) return;

        event.preventDefault();
        setActiveNav(link.dataset.target);
        scrollToSection(target, () => {
          focusSection(target);
          if (window.location.hash !== link.hash){
            window.history.pushState(null, '', link.hash);
          }
        });
      });
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

    // Reveal each item as it enters the viewport so long sections animate while scrolling.
    (function initScrollReveal(){
      const items = document.querySelectorAll('.reveal');
      if (!('IntersectionObserver' in window)){
        items.forEach(item => item.classList.add('in-view'));
        return;
      }

      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

      items.forEach(item => revealObserver.observe(item));
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

// Make static project cards open their link when clicked (except when clicking an inner link)
document.querySelectorAll('.proj-card-static').forEach(el => {
  const url = el.dataset.projectUrl;
  if (!url) return;
  el.addEventListener('click', (e) => {
    if (e.target.closest('a')) return; // let actual links behave normally
    window.open(url, '_blank', 'noopener');
  });
});

// Back to top button (in the footer)
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn){
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}