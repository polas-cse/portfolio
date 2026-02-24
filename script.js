/* ══════════════════════════════════════
   POLAS HOSSAIN PORTFOLIO — SCRIPTS
   script.js
══════════════════════════════════════ */

/* ══════════════════════════════
   1. THEME TOGGLE (Dark / Light)
══════════════════════════════ */
(function () {
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;

  // Restore saved preference
  const saved = localStorage.getItem('ph-theme') || 'dark';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('ph-theme', next);
  });

  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    icon.textContent = t === 'dark' ? '☀' : '🌙';
    btn.title = t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  }
})();


/* ══════════════════════════════
   2. CUSTOM CURSOR
   Hidden on touch/mobile via CSS — no JS needed for that
══════════════════════════════ */
(function () {
  const cur = document.getElementById('cur');
  const trail = document.getElementById('cur-trail');

  // Skip entirely on touch devices
  if (!cur || window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  let mx = -300, my = -300;
  let tx = -300, ty = -300;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
  });

  // Smooth lag trail
  (function loop() {
    tx += (mx - tx) * 0.08;
    ty += (my - ty) * 0.08;
    trail.style.left = tx + 'px';
    trail.style.top = ty + 'px';
    requestAnimationFrame(loop);
  })();

  // Hover state on interactive elements
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('lh'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('lh'));
  });
})();


/* ══════════════════════════════
   3. PLASMA / WAVE CANVAS
══════════════════════════════ */
(function () {
  const cv = document.getElementById('plasmaCanvas');
  const ctx = cv.getContext('2d');
  let W, H, t = 0;

  const resize = () => {
    W = cv.width = cv.offsetWidth;
    H = cv.height = cv.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  function hsl(h, s, l, a) { return `hsla(${h},${s}%,${l}%,${a})`; }

  const waves = [
    { amp: 70, freq: .0014, sp: 1, yf: .32, h: 195, s: 100, l: 52, a: .07 },
    { amp: 55, freq: .002, sp: 1.6, yf: .5, h: 160, s: 100, l: 58, a: .055 },
    { amp: 45, freq: .0016, sp: .9, yf: .65, h: 265, s: 80, l: 62, a: .04 },
    { amp: 32, freq: .0028, sp: 2.1, yf: .18, h: 195, s: 100, l: 50, a: .04 },
    { amp: 28, freq: .0032, sp: 1.3, yf: .8, h: 175, s: 100, l: 55, a: .035 },
  ];

  function drawPlasma() {
    ctx.clearRect(0, 0, W, H);
    t += .004;

    waves.forEach(w => {
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W + 4; x += 4) {
        const y = H * w.yf
          + Math.sin(x * w.freq + t * w.sp) * w.amp
          + Math.sin(x * w.freq * 1.8 + t * w.sp * .7) * w.amp * .4
          + Math.sin(x * w.freq * .6 + t * w.sp * 1.3) * w.amp * .25;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, hsl(w.h, w.s, w.l, w.a));
      g.addColorStop(1, hsl(w.h, w.s, w.l, 0));
      ctx.fillStyle = g;
      ctx.fill();
    });

    for (let i = 0; i < 7; i++) {
      const yBase = H * (.08 + i * .14);
      const alpha = .014 + Math.sin(t * 1.4 + i * .8) * .008;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const yy = yBase + Math.sin(x * .005 + t * 1.2 + i) * 14
          + Math.sin(x * .012 - t + i * .5) * 7;
        x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
      ctx.lineWidth = .9;
      ctx.stroke();
    }
    requestAnimationFrame(drawPlasma);
  }
  drawPlasma();
})();


/* ══════════════════════════════
   4. MATRIX RAIN CANVAS
══════════════════════════════ */
(function () {
  const cv = document.getElementById('matrixCanvas');
  const ctx = cv.getContext('2d');

  const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
  resize();
  window.addEventListener('resize', resize);

  const chars = 'アイウエオカサスセソ01BEF9JAVASPRINGDOCKERPOSTGRES><{}[]//';
  const fs = 13;
  let cols, drops = [];

  const init = () => {
    cols = Math.floor(cv.width / fs);
    drops = Array(cols).fill(0);
  };
  init();
  window.addEventListener('resize', init);

  setInterval(() => {
    ctx.fillStyle = 'rgba(2,5,8,.052)';
    ctx.fillRect(0, 0, cv.width, cv.height);

    for (let i = 0; i < drops.length; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      const lead = Math.random() > .93;
      ctx.font = `${lead ? fs + 1 : fs}px 'JetBrains Mono',monospace`;
      ctx.fillStyle = lead
        ? `rgba(160,255,200,.98)`
        : `rgba(0,${180 + Math.random() * 75},${180 + Math.random() * 75},${.25 + Math.random() * .3})`;
      ctx.fillText(ch, i * fs, drops[i] * fs);

      if (drops[i] * fs > cv.height && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    }
  }, 48);
})();


/* ══════════════════════════════
   5. NEURAL NETWORK / PARTICLE CANVAS
══════════════════════════════ */
(function () {
  const cv = document.getElementById('networkCanvas');
  const ctx = cv.getContext('2d');
  let W, H, pts = [];

  const resize = () => { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; };
  resize();
  window.addEventListener('resize', () => { resize(); init(); });

  const palette = ['0,212,255', '0,255,136', '139,92,246', '0,180,255'];

  const init = () => {
    pts = [];
    const n = Math.floor(W * H / 6500);
    for (let i = 0; i < n; i++) {
      pts.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
        r: Math.random() * 1.8 + .6,
        c: palette[Math.floor(Math.random() * palette.length)],
        phase: Math.random() * Math.PI * 2,
        speed: .018 + Math.random() * .018,
      });
    }
  };
  init();

  let mX = W * .5, mY = H * .5;
  document.addEventListener('mousemove', e => { mX = e.clientX; mY = e.clientY; });

  const MAX_DIST = 145, MAX_SPEED = 1.6;

  function drawNetwork() {
    ctx.clearRect(0, 0, W, H);

    pts.forEach(p => {
      p.phase += p.speed;
      const pulse = .55 + Math.sin(p.phase) * .3;

      const dx = p.x - mX, dy = p.y - mY;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 150) { const f = .09 * (1 - d / 150); p.vx += dx / d * f; p.vy += dy / d * f; }

      p.vx += (W * .5 - p.x) * 0.000035;
      p.vy += (H * .5 - p.y) * 0.000035;

      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > MAX_SPEED) { p.vx = p.vx / spd * MAX_SPEED; p.vy = p.vy / spd * MAX_SPEED; }

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.c},${pulse * .8})`; ctx.fill();

      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * pulse * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.c},.04)`; ctx.fill();
    });

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const a = (1 - dist / MAX_DIST) * .28;
          const g = ctx.createLinearGradient(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
          g.addColorStop(0, `rgba(${pts[i].c},${a})`);
          g.addColorStop(1, `rgba(${pts[j].c},${a * .4})`);
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = g; ctx.lineWidth = .75; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawNetwork);
  }
  drawNetwork();
})();


/* ══════════════════════════════
   6. SCROLL REVEAL
══════════════════════════════ */
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
    });
  }, { threshold: .1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();


/* ══════════════════════════════
   7. PARALLAX ON SCROLL
══════════════════════════════ */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const grid = document.querySelector('.h-grid');
  if (grid) grid.style.transform = `translateY(${y * .1}px)`;
  document.querySelectorAll('.orb').forEach((o, i) => {
    o.style.transform = `translateY(${y * (i % 2 === 0 ? .07 : -.05)}px) scale(${1 + y * .00006})`;
  });
});