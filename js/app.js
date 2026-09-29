
/* shared: reveal on scroll, gate, scroll hint, always start at top */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
scrollTo(0, 0); addEventListener('pageshow', () => scrollTo(0, 0));
const $ = s => document.querySelector(s), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer:coarse)').matches || matchMedia('(max-width:820px)').matches;
const saveGPU = coarse || reduce || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
const DPR = Math.min(saveGPU ? 1.25 : 2, devicePixelRatio || 1);
document.documentElement.classList.toggle('save-gpu', saveGPU);
function rnd(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
function enter(delay) {
  const g = $('#gate'); if (!g || g.classList.contains('open')) return; g.classList.add('open');
  setTimeout(() => { document.body.classList.remove('locked'); g.classList.add('gone'); }, reduce ? 0 : delay);
  setTimeout(() => { g.remove(); io(); const h = $('#hint'); if (h && scrollY < 40) h.classList.add('on'); }, reduce ? 50 : delay + 1200);
}
let __io = null; function io() {
  if (__io) return; const o = __io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); o.unobserve(e.target); } }), { threshold: .14 });
  document.querySelectorAll('.rv').forEach((el, i) => { if (!el.style.transitionDelay) el.style.transitionDelay = (i % 3) * .12 + 's'; o.observe(el); });
}
addEventListener('scroll', () => { const h = $('#hint'); if (h && scrollY > 40) h.classList.remove('on'); }, { passive: true });

const jaal = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><g fill='none' stroke='%23C7DA9C' stroke-width='1.2'><path d='M60 10 C 80 30 80 50 60 60 C 40 50 40 30 60 10Z'/><path d='M60 110 C 80 90 80 70 60 60 C 40 70 40 90 60 110Z'/><path d='M10 60 C 30 40 50 40 60 60 C 50 80 30 80 10 60Z'/><path d='M110 60 C 90 40 70 40 60 60 C 70 80 90 80 110 60Z'/><circle cx='60' cy='60' r='4'/></g><g fill='%23C7DA9C'><circle cx='0' cy='0' r='2'/><circle cx='120' cy='0' r='2'/><circle cx='0' cy='120' r='2'/><circle cx='120' cy='120' r='2'/></g></svg>`;
document.documentElement.style.setProperty('--jaal', `url("data:image/svg+xml,${jaal.replace(/</g, '%3C').replace(/>/g, '%3E').replace(/"/g, "'")}")`);
// flourishes
document.querySelectorAll('.fl-orn').forEach(s => s.innerHTML = `<path pathLength="1" d="M90 20 C 70 4 44 6 40 20 C 36 32 52 36 58 26 C 62 18 52 14 48 20"/><path pathLength="1" d="M90 20 C 110 4 136 6 140 20 C 144 32 128 36 122 26 C 118 18 128 14 132 20"/><path pathLength="1" d="M4 20 H34 M146 20 H176"/><circle class="d" cx="90" cy="20" r="3"/><circle class="d" cx="90" cy="32" r="1.6"/><circle class="d" cx="90" cy="8" r="1.6"/>`);
// tracker
const diya = `<svg viewBox="0 0 22 22"><path d="M2 13 Q11 22 20 13 Z" fill="#B8742E"/><path d="M2 13 H20" stroke="#F2C66D" stroke-width="1.2"/><g class="fl"><path d="M11 3 Q14 8 11 12 Q8 8 11 3Z" fill="#FFB43A"/><path d="M11 6 Q12.5 9 11 11.5 Q9.5 9 11 6Z" fill="#FFF2B0"/><circle cx="11" cy="9" r="6" fill="#FFB43A" opacity=".25"/></g></svg>`;
$('#diyas').innerHTML = [...Array(7)].map(() => `<span class="dy">${diya}</span>`).join('');
const dys = [...document.querySelectorAll('.dy')];
function chapters() { return [...document.querySelectorAll('.ch')].filter(c => c.offsetParent !== null).slice(0, 7); }

/* ---------- festive gate: toran + bokeh ---------- */
(function () {
  const r = rnd(12); let h = '<path d="M0 20 Q270 50 540 20" stroke="#E2BF6A" stroke-width="3" fill="none"/>';
  for (let i = 0; i < 19; i++) {
    const x = 14 + i * 28.5, y0 = 20 + 30 * Math.sin(Math.PI * x / 540), n = i % 2 ? 5 : 3; h += `<g class="tst" style="transform-origin:${x}px ${y0}px"><line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + n * 14}" stroke="#7A5A10"/>`;
    for (let k = 0; k < n; k++)h += `<circle cx="${x}" cy="${y0 + 8 + k * 14}" r="7.5" fill="${(k + i) % 3 ? '#F29F05' : '#E8590C'}"/>`; h += `<path d="M${x} ${y0 + n * 14 + 3} q-6 12 0 22 q6 -10 0 -22z" fill="#4F7A2A"/></g>`;
  }
  $('#gtoran').innerHTML = h;
})();
const BD = DPR, bk = $('#bokeh'), bkx = bk.getContext('2d'); function rsBk() { if (!bk) return; bk.width = innerWidth * BD; bk.height = innerHeight * BD; } rsBk(); addEventListener('resize', rsBk);
const BK = [...Array(saveGPU ? 14 : 34)].map((_, i) => { const r = rnd(i * 7 + 3); return { x: r(), y: r(), s: 6 + r() * 22, v: .004 + r() * .01, ph: r() * 6, c: r() < .7 ? [255, 210, 130] : [255, 160, 190] }; });
(function bl(ts) {
  if (!$('#gate') || !$('#bokeh')) return; if (document.hidden) { requestAnimationFrame(bl); return; } const t = ts / 1000, W = bk.width, H = bk.height; bkx.clearRect(0, 0, W, H);
  for (const b of BK) { const y = ((b.y - t * b.v) % 1 + 1) % 1, x = b.x + Math.sin(t * .3 + b.ph) * .02, a = .18 + .22 * Math.sin(t * .8 + b.ph) ** 2, R = b.s * BD, g = bkx.createRadialGradient(x * W, y * H, 0, x * W, y * H, R); g.addColorStop(0, `rgba(${b.c},${a})`); g.addColorStop(1, `rgba(${b.c},0)`); bkx.fillStyle = g; bkx.beginPath(); bkx.arc(x * W, y * H, R, 0, 6.283); bkx.fill(); }
  if (!saveGPU) document.querySelectorAll('.tst').forEach((g, i) => g.style.transform = `rotate(${Math.sin(t * 1.2 + i) * 3}deg)`); requestAnimationFrame(bl);
})(0);
/* ---------- clouds ---------- */
function bank(seed, y0, y1, n, col, op, yEnd) {
  yEnd = yEnd || 1100; const r = rnd(seed); let s = `<defs><filter id="cb${seed}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="${saveGPU ? 4 : 9}"/></filter></defs><g filter="url(#cb${seed})" fill="${col}" opacity="${op}">`;
  for (let i = 0; i < n; i++) { const x = r() * 600 - 30, y = y0 + r() * (y1 - y0), rx = 50 + r() * 90, ry = 26 + r() * 40; s += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}"/>`; }
  for (let y = y1 - 30; y < yEnd; y += 40)for (let x = -40; x < 620; x += 70)s += `<ellipse cx="${x + r() * 30}" cy="${y + r() * 20}" rx="${70 + r() * 40}" ry="${40 + r() * 20}"/>`; return s + '</g>';
}
$('#cloudB').innerHTML = bank(4, 620, 800, saveGPU ? 18 : 40, '#E89A80', .0, 2000);
$('#cloudF').innerHTML = bank(9, 1000, 1100, saveGPU ? 22 : 46, '#F6C9A8', 1, 2700) + `<g fill="#FFFFFF" opacity=".7" filter="url(#cb9)">${[...Array(saveGPU ? 4 : 8)].map((_, i) => { const r = rnd(i + 50); return `<ellipse cx="${(r() * 540).toFixed(0)}" cy="${(80 + r() * 360).toFixed(0)}" rx="${(40 + r() * 50).toFixed(0)}" ry="${(10 + r() * 10).toFixed(0)}"/>` }).join('')}</g>`;
function descent() {
  const clamp = x => x < 0 ? 0 : x > 1 ? 1 : x; const H = innerHeight, d = clamp((scrollY - H * .28) / (H * .72)); const ss = (a, b, x) => { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };
  $('#bgH').style.opacity = 1 - ss(.42, .58, d);
  $('#cloudB').style.transform = `translateY(${-d * H * 1.1}px) scale(${1 + d * .25})`; $('#cloudB').style.opacity = 1 - ss(.5, .75, d);
  $('#cloudF').style.transform = `translateY(${-d * H * 1.7}px) scale(${1 + d * .5})`; $('#cloudF').style.opacity = 1 - ss(.55, .8, d);
  $('#fog').style.opacity = ss(.3, .48, d) * (1 - ss(.52, .72, d));
  $('#bgM').style.opacity = ss(.45, .6, d) * (1 - ss(.72, 1, d));
  const c2 = $('#ch2'); if (c2) c2.style.opacity = .15 + .85 * ss(.5, .8, d);
  if (!window.__sunW || window.__sunW < .5) $('#track').classList.toggle('dayt', d < .6);
}
let __desR = 0; addEventListener('scroll', () => { if (__desR) return; __desR = requestAnimationFrame(() => { __desR = 0; descent(); }); }, { passive: true }); addEventListener('resize', descent); descent();
/* ---------- join-hands gate ---------- */
const K = $('#knot'), ks = $('#ksvg'), hL = $('#hL'), hR = $('#hR');
let W = 0, Y0 = 110, eL, eR, yL = Y0, yR = Y0, drag = null, tied = false, HK = 1;
function reachPath(skin, shade) {
  return `<path d="M-440 -22 L-118 -20 C-96 -24 -78 -27 -60 -25 C-42 -23 -28 -18 -14 -14 C-6 -12 1 -9 3 -5 C4 -1 0 1 -5 0 C-14 -1 -24 0 -31 2 C-25 3 -14 5 -8 8 C-3 11 -5 15 -11 14 C-20 13 -30 12 -38 12 C-32 14 -25 17 -21 20 C-17 23 -21 26 -27 24 C-34 22 -41 20 -47 19 C-43 22 -38 25 -36 28 C-35 31 -39 33 -44 31 C-52 28 -58 26 -64 24 C-76 24 -94 22 -118 20 L-440 22Z" fill="${skin}" stroke="${shade}" stroke-width=".9"/>
 <path d="M-31 2 C-40 4 -50 6 -60 8 M-38 12 C-46 13 -54 14 -62 15 M-47 19 C-52 20 -58 21 -64 22" stroke="${shade}" stroke-width=".8" fill="none" opacity=".55"/>`;
}
function brideMehndi() { return `<g fill="none" stroke="#9A4A22" stroke-width=".9" opacity=".85"><circle cx="-70" cy="-10" r="7"/><circle cx="-70" cy="-10" r="3"/><path d="M-60 -14 q8 -2 14 2 M-50 -18 q6 0 10 3 M-84 -12 q-6 6 -2 12"/></g><g fill="#9A4A22" opacity=".85"><circle cx="-56" cy="-8" r="1"/><circle cx="-48" cy="-6" r="1"/><circle cx="-40" cy="-4" r="1"/></g>`; }
function chooda() {
  let b = '';
  const ring = (x, col, w, glint) => `<ellipse cx="${x}" cy="0" rx="3.6" ry="25" fill="none" stroke="${col}" stroke-width="${w}"/>` + (glint ? `<path d="M${x - 2.2} -18 q-1.4 8 0 14" stroke="rgba(255,255,255,.75)" stroke-width="1.1" fill="none" stroke-linecap="round"/>` : '');
  b += ring(-124, '#E2BF6A', 2.2, false);
  for (let i = 0; i < 8; i++) { const x = -130 - i * 5.4; b += ring(x, i % 3 === 1 ? '#F5EBDA' : '#C8102E', 4.4, true); }
  b += ring(-176, '#E2BF6A', 2.2, false);
  return b + `<rect x="-440" y="-30" width="246" height="60" fill="#A80F2A"/><rect x="-194" y="-31" width="7" height="62" fill="#E2BF6A"/>`;
}
function rudra(cx, y0) {
  let g = `<path d="M${cx} -24 C${cx + 8} -12 ${cx + 8} 12 ${cx} 24" stroke="#5A3A1A" stroke-width="1" fill="none"/>`;
  const n = 8; for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + Math.PI * (i + .5) / n, x = cx + 6 * Math.cos(a), y = 23 * Math.sin(a), r = 3.9;
    g += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="${r}" fill="url(#rudG)" stroke="#2E1608" stroke-width=".5"/><path d="M${-r * .7} ${-r * .3} q${r * .7} -1.2 ${r * 1.4} 0 M${-r * .75} ${r * .3} q${r * .75} 1.2 ${r * 1.5} 0 M0 ${-r} v${r * 2}" stroke="#3E1E0C" stroke-width=".5" fill="none" opacity=".7"/></g>`;
  }
  return g + `<circle cx="${cx + 1}" cy="-26" r="2.2" fill="#E2BF6A"/>`;
}
function cuff(x) { return `<rect x="${x}" y="-30" width="${440 - x}" height="60" fill="#F3E6CC"/><rect x="${x - 4}" y="-31" width="9" height="62" fill="#E2BF6A"/><path d="M${x + 2} -26 v52" stroke="#B8862F" stroke-dasharray="2 3"/>`; }
/* ---- held pose: her hand (fingers to the right), his hand from the right wrapping around it ---- */
function heldPose() {
  // his hand: open, pointing left, slightly lower; her hand rests on top of it
  const his = `<g transform="translate(-34 10) scale(-1 1)">${reachPath('url(#skM)', '#A8704E')}${rudra(-128, -21)}<rect x="-440" y="-30" width="290" height="60" fill="#F3E6CC"/><rect x="-156" y="-31" width="9" height="62" fill="#E2BF6A"/><path d="M-151 -26 v52" stroke="#B8862F" stroke-dasharray="2 3"/></g>`;
  const her = `<g transform="translate(34 -6)">${reachPath('url(#skF)', '#C98A66')}${brideMehndi()}${chooda()}</g>`;
  return his + `<g style="filter:drop-shadow(0 3px 4px rgba(60,10,20,.35))">${her}</g>`;
}

(function () {
  hL.innerHTML = reachPath('url(#skF)', '#C98A66') + brideMehndi() + chooda() + `<g class="gripg"><circle cx="-62" cy="-4" r="13" fill="none" stroke="#FFE7A8" stroke-width="2" class="grip"/></g>`;
  hR.innerHTML = reachPath('url(#skM)', '#A8704E') + rudra(-128, -21) + cuff(-420).replace(/x="-420"[^/]*\/>/, '') + `<rect x="-420" y="-30" width="270" height="60" fill="#F3E6CC"/><rect x="-156" y="-31" width="9" height="62" fill="#E2BF6A"/><path d="M-151 -26 v52" stroke="#B8862F" stroke-dasharray="2 3"/><g class="gripg"><circle cx="-62" cy="-4" r="13" fill="none" stroke="#FFE7A8" stroke-width="2" class="grip"/></g>`;
  $('#hHeld').innerHTML = heldPose();
})();
function home() { W = K.clientWidth; ks.setAttribute('viewBox', `0 0 ${W} 220`); HK = Math.min(1, W / 500); eL = W * .37; eR = W * .63; yL = yR = Y0; draw(); }
function draw() { hL.setAttribute('transform', `translate(${eL} ${yL}) scale(${HK})`); hR.setAttribute('transform', `translate(${eR} ${yR}) scale(${-HK} ${HK})`); $('#knPos').setAttribute('transform', `translate(${W / 2} ${Y0})`); $('#hHeld').setAttribute('transform', `translate(${W / 2} ${Y0}) scale(${HK * 1.05})`); }
function pt(e) { const b = K.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; }
function warmGateAudio() { if (warmGateAudio._d) return; warmGateAudio._d = 1; const a = document.getElementById('shloka'); if (!a) return; try { a.load(); } catch (_) { } a.muted = true; a.volume = 0; const p = a.play(); if (p && p.then) p.then(() => { a.pause(); a.currentTime = 0; a.muted = false; }).catch(() => { a.muted = false; }); }
K.addEventListener('pointerdown', e => { if (tied) return; const [x, y] = pt(e); if (Math.abs(y - Y0) > 90) return; warmGateAudio(); drag = x < W / 2 ? 'L' : 'R'; window.__goff = (drag === 'L' ? eL : eR) - x; K.setPointerCapture(e.pointerId); K.style.cursor = 'grabbing'; });
K.addEventListener('pointermove', e => { if (!drag || tied) return; const [x, y] = pt(e), yy = Math.max(60, Math.min(190, y)); const xx = x + (window.__goff || 0); if (drag === 'L') { eL = Math.max(40, Math.min(W - 30, xx)); yL = yy; } else { eR = Math.max(30, Math.min(W - 40, xx)); yR = yy; } draw(); if (eR - eL < 20 && Math.abs(yL - yR) < 50) tie(); });
function release() { if (!drag || tied) { drag = null; return; } drag = null; K.style.cursor = 'grab'; const s0 = { eL, eR, yL, yR }, t0 = performance.now(); (function f(n) { if (tied) return; const p = Math.min(1, (n - t0) / 500), e = 1 - Math.pow(1 - p, 3); eL = s0.eL + (W * .32 - s0.eL) * e; eR = s0.eR + (W * .68 - s0.eR) * e; yL = s0.yL + (Y0 - s0.yL) * e; yR = s0.yR + (Y0 - s0.yR) * e; draw(); if (p < 1) requestAnimationFrame(f); })(t0); }
K.addEventListener('pointerup', release); K.addEventListener('pointercancel', release);
function tie() {
  if (tied) return; tied = true; drag = null; const s0 = { eL, eR, yL, yR }, t0 = performance.now();
  (function f(n) { const p = Math.min(1, (n - t0) / 380), e = 1 - Math.pow(1 - p, 3); eL = s0.eL + (W / 2 - 2 - s0.eL) * e; eR = s0.eR + (W / 2 + 2 - s0.eR) * e; yL = s0.yL + (Y0 - s0.yL) * e; yR = s0.yR + (Y0 - s0.yR) * e; draw(); if (p < 1) requestAnimationFrame(f); })(t0);
  $('#gate').classList.add('tied'); startMusic(); if (navigator.vibrate) navigator.vibrate(40); const b = K.getBoundingClientRect(); setTimeout(() => burst(b.left + W / 2, b.top + Y0 - 60, saveGPU ? 28 : 70), 300);
  const om = $('#omx'), gr = $('#gate').getBoundingClientRect(); om.style.left = (b.left - gr.left + W / 2) + 'px'; om.style.top = (b.top - gr.top + Y0) + 'px'; $('#gate').appendChild(om);
  setTimeout(() => {
    const g = $('#gate'); g.classList.add('opening');
    setTimeout(() => { g.classList.add('entering'); document.body.classList.add('arrived'); }, 750);
    setTimeout(() => { document.body.classList.remove('locked'); g.classList.add('gone'); }, 1300);
    setTimeout(() => { const hc = $('#heavenCh'); hc.classList.add('go'); hc.querySelectorAll('.rv').forEach((el, i) => el.style.transitionDelay = (0.05 + i * 0.16) + 's'); io(); $('#track').classList.add('on'); update(); descent(); }, 1250);
    setTimeout(() => { g.remove(); const h = $('#hint'); if (h && scrollY < 40) setTimeout(() => h.classList.add('on'), 1200); }, 2200);
  }, 2500);
}

$('#kbdTie').addEventListener('click', () => { warmGateAudio(); tie(); });
addEventListener('resize', () => { if (!tied) home(); });
home();
// hand hint: gently nudge the left cloth
let nudgeT = performance.now(), nudgeSkip = 0; (function nud(n) { if (tied || drag || !$('#gate')) return; if (saveGPU && (++nudgeSkip & 1)) { requestAnimationFrame(nud); return; } const p = ((n - nudgeT) / 2200) % 1, e = Math.sin(Math.min(1, p / .5) * Math.PI); eL = W * .37 + e * W * .04; draw(); requestAnimationFrame(nud); })(nudgeT);
/* ---------- petals / burst ---------- */
const fx = $('#fx'), fc = fx.getContext('2d'); let parts = [], fxOn = false;
function rsFx() { fx.width = innerWidth * DPR; fx.height = innerHeight * DPR; } rsFx(); addEventListener('resize', rsFx);
function burst(x, y, n) { const r = rnd(Date.now() % 9999 + 3); for (let i = 0; i < n; i++) { const a = r() * 6.283, sp = 3 + r() * 8; parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 5, l: 1, c: ['#F29F05', '#E8590C', '#8FAE5A', '#E2BF6A', '#C2185B'][i % 5], r: r() * 6 }); } if (!fxOn) { fxOn = true; requestAnimationFrame(fxLoop); } }
function fxLoop() { fc.clearRect(0, 0, fx.width, fx.height); parts = parts.filter(p => p.l > 0); for (const p of parts) { p.vy += .25; p.x += p.vx; p.y += p.vy; p.vx *= .98; p.l -= .012; p.r += .15; fc.save(); fc.globalAlpha = Math.min(1, p.l * 1.4); fc.translate(p.x * DPR, p.y * DPR); fc.rotate(p.r); fc.fillStyle = p.c; fc.beginPath(); fc.ellipse(0, 0, 5 * DPR, 3 * DPR, 0, 0, 6.283); fc.fill(); fc.restore(); } if (parts.length) requestAnimationFrame(fxLoop); else fxOn = false; }
/* ---------- mehndi game (Easy / Hard) ---------- */
const petal = (r, w, h) => `M0 ${-r} C ${w} ${-r - h * .4}, ${w} ${-r - h}, 0 ${-r - h} C ${-w} ${-r - h}, ${-w} ${-r - h * .4}, 0 ${-r}Z`;
const GW = 360, GH = 520, MODES = {
  easy: { fs: 14, decoys: [], motifs: 150, rot: 50, clear: 24, camo: false, hint: 15000, reveal: 30000 },
  hard: { fs: 11, decoys: ['Ansh', 'Anmol', 'Shagun', 'Gunjan', 'Sajan', 'Aman', 'Anshu', 'Ashu', 'Anuj', 'Anshi', 'Shanu', 'Anil'], motifs: 330, rot: 160, clear: 9, camo: true, hint: 45000, reveal: 90000 }
};
function buildPattern(m) {
  const cfg = MODES[m], r = Math.random, H = '#7A3314', words = []; let s = ''; const V = (d, w) => `<path d="${d}" fill="none" stroke="${H}" stroke-width="${w}" stroke-linecap="round"/>`;
  for (let x = -40; x < GW + 40; x += 30)s += V(`M${x} 0 Q ${x + 15} ${GH / 2} ${x} ${GH}`, .5);
  function place(txt, isT) {
    let x, y, tries = 0; do { x = 40 + r() * (GW - 120); y = 60 + r() * (GH - 110); tries++; } while (tries < 40 && words.some(w => Math.hypot(w.x - x, w.y - y) < 60)); const a = (r() - .5) * cfg.rot; words.push({ txt, x, y, a, isT, len: txt.length * cfg.fs * .445 });
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})"><text ${isT ? 'class="nmTxt"' : ''} font-family="Great Vibes, cursive" font-size="${cfg.fs}" fill="${H}" opacity=".92">${txt}</text></g>`;
  }
  let wtxt = ''; cfg.decoys.forEach(d => wtxt += place(d, false)); wtxt += place('Anshul', true); const target = words[words.length - 1];
  const tc = [target.x + Math.cos(target.a * Math.PI / 180) * target.len / 2, target.y - 4];
  for (let i = 0, n = 0; i < 900 && n < cfg.motifs; i++) {
    const x = r() * GW, y = r() * GH, a = r() * 360, k = r(), sc = .45 + r() * .6; if (Math.hypot(x - tc[0], y - tc[1]) < cfg.clear + (m === 'easy' ? target.len * .45 : 0)) continue; n++;
    if (k < .24) s += `<g transform="translate(${x} ${y}) rotate(${a}) scale(${sc})">${V('M0 0 C 14 -12 30 4 18 20 C 10 28 -4 24 -4 12 C -4 4 4 2 6 8', 1.5)}${V('M4 6 C 10 2 18 8 14 16', 1)}${V('M-2 12 C 2 20 12 22 16 16', .8)}<circle cx="-8" cy="-6" r="1.6" fill="${H}"/></g>`;
    else if (k < .44) s += `<g transform="translate(${x} ${y}) rotate(${a}) scale(${sc})">` + [0, 60, 120, 180, 240, 300].map(q => `<path d="${petal(3, 5, 11)}" transform="rotate(${q})" fill="none" stroke="${H}" stroke-width="1.1"/>`).join('') + `<circle r="2.4" fill="${H}"/></g>`;
    else if (k < .64) { const x2 = x + (r() - .5) * 120, y2 = y + (r() - .5) * 120; s += V(`M${x} ${y} Q ${(x + x2) / 2 + (r() - .5) * 50} ${(y + y2) / 2 + (r() - .5) * 50} ${x2} ${y2}`, 1.1); for (let j = 0; j < 5; j++) { const t = .15 + j * .17, lx = x + (x2 - x) * t, ly = y + (y2 - y) * t; s += `<ellipse cx="${lx}" cy="${ly}" rx="4.5" ry="1.8" transform="rotate(${r() * 180} ${lx} ${ly})" fill="none" stroke="${H}" stroke-width=".9"/>`; } }
    else if (k < .78) s += `<g transform="translate(${x} ${y}) rotate(${a})">` + [...Array(6)].map((_, j) => `<circle cx="${j * 5}" cy="${Math.sin(j) * 3}" r="1.1" fill="${H}"/>`).join('') + `</g>`;
    else if (k < .9) s += `<g transform="translate(${x} ${y}) scale(${sc})"><circle r="10" fill="none" stroke="${H}" stroke-width="1"/><circle r="6" fill="none" stroke="${H}" stroke-width=".8" stroke-dasharray="1 2"/><circle r="2" fill="${H}"/></g>`;
    else s += `<g transform="translate(${x} ${y}) rotate(${a}) scale(${sc})">${V('M-12 0 Q -6 -8 0 0 Q 6 8 12 0', 1)}${V('M-12 4 Q -6 -4 0 4 Q 6 12 12 4', .7)}</g>`;
  }
  const a = target.a * Math.PI / 180, cx = target.x + Math.cos(a) * target.len / 2, cy = target.y + Math.sin(a) * target.len / 2 - 4;
  if (cfg.camo) {
    s += V(`M${cx - 40 * Math.cos(a)} ${cy - 40 * Math.sin(a) + 10} Q ${cx} ${cy - 14}, ${cx + 44 * Math.cos(a)} ${cy + 44 * Math.sin(a) - 6}`, 1);
    for (const [dx, dy, rt] of [[-26, -12, 40], [30, 14, 210], [6, -20, 120]]) s += `<g transform="translate(${cx + dx} ${cy + dy}) rotate(${rt}) scale(.55)">${V('M0 0 C 14 -12 30 4 18 20 C 10 28 -4 24 -4 12 C -4 4 4 2 6 8', 1.5)}<circle cx="-8" cy="-6" r="1.6" fill="${H}"/></g>`;
    for (let j = 0; j < 5; j++)s += `<circle cx="${cx - 18 + j * 9}" cy="${cy + 12 + Math.sin(j) * 3}" r="1" fill="${H}"/>`;
  }
  else { // easy: a gentle mehndi frame of leaves and dots around the name, so it sits inside the pattern
    for (let j = 0; j < 7; j++) { const t = j / 6 * Math.PI * 2, px = cx + Math.cos(t) * (target.len * .62 + 14), py = cy + Math.sin(t) * 20; s += `<ellipse cx="${px}" cy="${py}" rx="4" ry="1.8" transform="rotate(${t * 57.3 + 90} ${px} ${py})" fill="none" stroke="${H}" stroke-width=".9"/>`; }
    for (let j = 0; j < 9; j++)s += `<circle cx="${cx - target.len * .55 + j * target.len * .14}" cy="${cy + 15}" r="1" fill="${H}"/>`;
  }
  const hx = Math.max(70, Math.min(GW - 70, cx)), hy = Math.max(70, Math.min(GH - 70, cy));
  return { words, target, html: `<g style="pointer-events:none">${s}</g>${wtxt}<circle class="hl" cx="${hx}" cy="${hy}" r="80" fill="rgba(255,240,180,.35)" stroke="#E2BF6A" stroke-width="2" stroke-dasharray="4 5"/>` };
}
const G = { easy: buildPattern('easy'), hard: buildPattern('hard') };
const ls = k => { try { return localStorage.getItem(k) === '1'; } catch (e) { return false; } };
const FOUND = { easy: ls('aw-found-easy'), hard: ls('aw-found-hard') || ls('aw-found') };
let mode = 'easy', found = false, target = null, words = null; const timers = { easy: null, hard: null };
const unlocked = m => m === 'easy' ? (FOUND.easy || FOUND.hard) : FOUND.hard;
const gsvg = $('#gsvg'), gmsg = $('#gmsg'); let tries = 0;
function ctr(w) { const a = w.a * Math.PI / 180; return [w.x + Math.cos(a) * w.len / 2 + Math.sin(a) * 5, w.y + Math.sin(a) * w.len / 2 - Math.cos(a) * 5]; }
function hit(w, px, py, pad) { const a = -w.a * Math.PI / 180, dx = px - w.x, dy = py - w.y, lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a); return lx > -pad && lx < w.len + pad && ly > -16 - pad && ly < 6 + pad; }
function say(t, ms) { gmsg.textContent = t; if (ms) setTimeout(() => { if (!found && gmsg.textContent === t) gmsg.textContent = ''; }, ms); }
function setLock(open) {
  const r = $('#rest'); if (open) { r.classList.add('open'); io(); document.querySelectorAll('#rest .fl-orn').forEach(el => dio.observe(el)); $('#lockNote').textContent = '✦ Unlocked. Keep scrolling'; }
  else { r.classList.remove('open'); $('#lockNote').textContent = mode === 'hard' && unlocked('easy') ? '🔒 Hard mode: find him again to unlock' : '🔒 The celebrations unlock once you find him'; } update();
}

/* ---------- dried henna paste: tap to crack it off ---------- */
const pcv = $('#gpaste'), peelMsg = $('#gpeelMsg');
const PASTE = { easy: { r: 58, k: 8 }, hard: { r: 34, k: 7 } };
let baseC = null, maskC = null, flakes = [], praf = 0, PW = 0, PH = 0, PS = 1;
function pasteArt() {
  baseC = document.createElement('canvas'); baseC.width = PW; baseC.height = PH;
  const c = baseC.getContext('2d'), g = c.createLinearGradient(0, 0, PW, PH);
  g.addColorStop(0, '#3E5522'); g.addColorStop(.45, '#2E4117'); g.addColorStop(1, '#243510');
  c.fillStyle = g; c.fillRect(0, 0, PW, PH);
  for (let i = 0; i < Math.round(PW * PH / 90); i++) {
    const x = Math.random() * PW, y = Math.random() * PH;
    c.fillStyle = Math.random() < .5 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.05)'; c.fillRect(x, y, 1.4 * PS, 1.4 * PS);
  }
  c.strokeStyle = 'rgba(18,26,8,.55)'; c.lineWidth = 1.1 * PS;
  for (let i = 0; i < 26; i++) {
    let x = Math.random() * PW, y = Math.random() * PH, a = Math.random() * 6.283;
    c.beginPath(); c.moveTo(x, y);
    for (let k = 0; k < 7; k++) { a += (Math.random() - .5) * 1.5; x += Math.cos(a) * 16 * PS; y += Math.sin(a) * 16 * PS; c.lineTo(x, y); } c.stroke();
  }
  c.strokeStyle = 'rgba(120,150,80,.18)'; c.lineWidth = .8 * PS;
  for (let i = 0; i < 14; i++) {
    let x = Math.random() * PW, y = Math.random() * PH, a = Math.random() * 6.283;
    c.beginPath(); c.moveTo(x, y);
    for (let k = 0; k < 5; k++) { a += (Math.random() - .5) * 1.6; x += Math.cos(a) * 18 * PS; y += Math.sin(a) * 18 * PS; c.lineTo(x, y); } c.stroke();
  }
}
function sizePaste() {
  const w = pcv.clientWidth, h = pcv.clientHeight; if (!w || !h) return;
  PS = DPR;
  const nw = Math.round(w * PS), nh = Math.round(h * PS);
  if (nw === PW && nh === PH) { drawPaste(); return; }
  const old = maskC; PW = pcv.width = nw; PH = pcv.height = nh;
  maskC = document.createElement('canvas'); maskC.width = PW; maskC.height = PH;
  if (old && old.width) maskC.getContext('2d').drawImage(old, 0, 0, PW, PH);
  pasteArt(); drawPaste();
}
addEventListener('resize', sizePaste);
function drawPaste() {
  if (!PW || !baseC) return;
  const c = pcv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, PW, PH);
  c.drawImage(baseC, 0, 0);
  c.globalCompositeOperation = 'destination-out'; if (maskC) c.drawImage(maskC, 0, 0);
  c.globalCompositeOperation = 'source-over';
  for (const f of flakes) {
    c.save(); c.translate(f.x, f.y); c.rotate(f.rot); c.globalAlpha = Math.max(0, Math.min(1, f.life));
    c.beginPath(); f.pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath();
    c.fillStyle = f.col; c.fill(); c.strokeStyle = 'rgba(16,24,8,.5)'; c.lineWidth = 1 * PS; c.stroke(); c.restore();
  }
}
function flakeLoop(ts) {
  if (!flakes.length) { praf = 0; drawPaste(); return; }
  const dt = Math.min(.05, (ts - (flakeLoop._t || ts)) / 1000); flakeLoop._t = ts;
  flakes = flakes.filter(f => f.life > 0 && f.y < PH + 80 * PS);
  for (const f of flakes) { f.vy += 1500 * PS * dt; f.x += f.vx * dt; f.y += f.vy * dt; f.rot += f.vr * dt; f.life -= dt * .55; }
  drawPaste(); praf = requestAnimationFrame(flakeLoop);
}
function peelAt(cx, cy, R, drop) {
  if (!maskC) return 0;
  const m = maskC.getContext('2d'), K = PASTE[mode].k + Math.floor(Math.random() * 3), cols = ['#35491C', '#2B3C15', '#3F5624'];
  let a0 = Math.random() * 6.283;
  for (let i = 0; i < K; i++) {
    const a1 = a0 + 6.283 / K * (.7 + Math.random() * .6), pts = [[0, 0]];
    for (let t = 0; t <= 3; t++) { const a = a0 + (a1 - a0) * t / 3, rr = R * (.62 + Math.random() * .5); pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
    m.save(); m.translate(cx, cy); m.fillStyle = '#000'; m.beginPath();
    pts.forEach((q, j) => j ? m.lineTo(q[0], q[1]) : m.moveTo(q[0], q[1])); m.closePath(); m.fill();
    m.strokeStyle = '#000'; m.lineWidth = 2 * PS; m.lineJoin = 'round'; m.stroke(); m.restore();
    if (drop !== false) flakes.push({
      pts, x: cx, y: cy, vx: (Math.random() - .5) * 90 * PS, vy: -40 * PS - Math.random() * 90 * PS,
      rot: 0, vr: (Math.random() - .5) * 5, life: 1.5, col: cols[i % 3]
    });
    a0 = a1;
  }
  if (!praf) { flakeLoop._t = 0; praf = requestAnimationFrame(flakeLoop); } else drawPaste();
  return K;
}
function peeledAt(cx, cy) {
  if (!maskC) return false;
  try { return maskC.getContext('2d').getImageData(Math.max(0, Math.min(PW - 1, cx | 0)), Math.max(0, Math.min(PH - 1, cy | 0)), 1, 1).data[3] > 128; } catch (e) { return true; }
}
function peelPct() {
  if (!maskC) return 0;
  try {
    const d = maskC.getContext('2d').getImageData(0, 0, PW, PH).data; let n = 0, s = 0;
    for (let i = 3; i < d.length; i += 160) { n++; if (d[i] > 128) s++; } return s / n;
  } catch (e) { return 0; }
}
function clearPaste(all) {
  if (!maskC) return; const m = maskC.getContext('2d');
  if (all) { m.fillStyle = '#000'; m.fillRect(0, 0, PW, PH); }
  else { m.clearRect(0, 0, PW, PH); flakes = []; }
  drawPaste();
}
function peelHint() { if (!target) return; const c = ctr(target); peelAt(c[0] / GW * PW, c[1] / GH * PH, PASTE[mode].r * PS * 1.9, true); }

function render() {
  const g = G[mode]; target = g.target; words = g.words; gsvg.innerHTML = g.html; found = unlocked(mode); tries = 0; $('#gctl').innerHTML = '';
  const gm = $('#game'); gm.classList.remove('hint'); gm.classList.toggle('found', found && (mode === 'easy' ? true : FOUND.hard));
  document.querySelectorAll('.gmode button').forEach(b => b.setAttribute('aria-pressed', b.dataset.m === mode));
  gmsg.textContent = found ? (FOUND[mode] ? 'You found him ✓' : 'Found in Hard mode ✓') : '';
  flakes = []; if (praf) { cancelAnimationFrame(praf); praf = 0; }
  sizePaste(); clearPaste(found); peelMsg.textContent = found ? '' : 'Tap the dried paste to crack it off';
  setLock(found); if (!found) startTimer(); else addRelock();
}
$('#game').addEventListener('click', e => {
  if (found) return; const b = pcv.getBoundingClientRect(); if (!b.width) return;
  const q = { x: (e.clientX - b.left) / b.width * GW, y: (e.clientY - b.top) / b.height * GH };
  const px = (e.clientX - b.left) / b.width * PW, py = (e.clientY - b.top) / b.height * PH; tries++;
  if (!peeledAt(px, py)) {
    peelAt(px, py, PASTE[mode].r * PS, true); const pct = Math.round(peelPct() * 100);
    peelMsg.textContent = pct < 97 ? pct + '% of the paste is off' : 'All of it is off — he is in there somewhere'; return;
  }
  if (hit(target, q.x, q.y, mode === 'easy' ? 20 : 16)) return win(); const d = words.find(w => !w.isT && hit(w, q.x, q.y, 6));
  if (d) { say(`“${d.txt}”? Nice try, not him!`, 1800); return; } const c = ctr(target), dist = Math.hypot(q.x - c[0], q.y - c[1]);
  say(dist < 55 ? 'So close! 🔥' : dist < 110 ? 'Very warm…' : dist < 190 ? 'Warmer…' : 'Cold ❄️', 1500);
});

function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; const ac = window.__ac || (window.__ac = new AC()); if (ac.state === 'suspended') ac.resume();
    const notes = [783.99, 987.77, 1174.66, 1567.98, 1975.53], t0 = ac.currentTime + .02, out = ac.createGain(); out.gain.value = .22; out.connect(ac.destination);
    notes.forEach((f, i) => { const t = t0 + i * .09;[1, 2.01, 3.02].forEach((h, k) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = f * h; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime([.5, .18, .07][k], t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + 1.8 - k * .4); o.connect(g); g.connect(out); o.start(t); o.stop(t + 2); }); });
  } catch (e) { }
}
function win() {
  chime(); setTimeout(() => { if (typeof setDuck === 'function') setDuck(false); }, 50); FOUND[mode] = true; try { localStorage.setItem('aw-found-' + mode, '1'); } catch (e) { } found = true; $('#game').classList.add('found'); $('#game').classList.remove('hint'); $('#gctl').innerHTML = '';
  say(mode === 'hard' ? 'You found him in Hard mode! Welcome' : 'Found him! Welcome to the celebrations');
  const b = gsvg.getBoundingClientRect(), sc = b.width / GW, c = ctr(target); burst(b.left + c[0] * sc, b.top + c[1] * sc, saveGPU ? 48 : 120);
  peelMsg.textContent = ''; for (let i = 0; i < 9; i++)setTimeout(() => peelAt(Math.random() * PW, Math.random() * PH, PASTE[mode].r * PS * 1.6, true), i * 70);
  setTimeout(() => clearPaste(true), 700);
  setLock(true); addRelock();
  setTimeout(() => { const n = $('#rest .ch'); if (n) n.scrollIntoView({ behavior: 'smooth' }); }, 1800);
}
let gen = 0;
function addRelock() { if ($('#relockBtn')) return; const b = document.createElement('button'); b.type = 'button'; b.id = 'relockBtn'; b.textContent = 'Lock the card again'; b.onclick = relock; $('#gctl').appendChild(b); }
function relock() {
  gen++; FOUND.easy = false; FOUND.hard = false;
  try { localStorage.removeItem('aw-found-easy'); localStorage.removeItem('aw-found-hard'); localStorage.removeItem('aw-found'); } catch (e) { }
  G.easy = buildPattern('easy'); G.hard = buildPattern('hard'); timers.easy = null; timers.hard = null;
  render(); say('Hidden again — find him');
  requestAnimationFrame(() => { const g = $('#game'); if (g) g.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
}
function startTimer() {
  const m = mode, g0 = gen; if (timers[m]) return; timers[m] = true;
  setTimeout(() => { if (gen === g0 && mode === m && !found && !$('#hbtn')) { const b = document.createElement('button'); b.type = 'button'; b.id = 'hbtn'; b.textContent = 'Need a hint?'; b.onclick = () => { $('#game').classList.add('hint'); peelHint(); say('He is inside the glowing circle…'); b.remove(); }; $('#gctl').appendChild(b); } }, MODES[m].hint);
  setTimeout(() => { if (gen === g0 && mode === m && !found) { const b = document.createElement('button'); b.type = 'button'; b.textContent = 'Reveal him'; b.onclick = win; $('#gctl').appendChild(b); } }, MODES[m].reveal);
}
document.querySelectorAll('.gmode button').forEach(b => b.addEventListener('click', () => { if (b.dataset.m === mode) return; mode = b.dataset.m; timers[mode] = null; render(); }));
setTimeout(render, 0);
addEventListener('scroll', () => {
  if (typeof setDuck !== 'function') return; const gr = $('#game').getBoundingClientRect(); setDuck(!found && gr.top < innerHeight * .75 && gr.bottom > innerHeight * .25);
  if (typeof setTrack === 'function') { const c2 = $('#ch2'); if (c2) setTrack(c2.getBoundingClientRect().top < innerHeight * .55); }
}, { passive: true });

/* ---------- draw-on-reveal ---------- */
const dio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('go'); dio.unobserve(e.target); } }), { threshold: .3 });
/* ---------- scroll-driven scenes ---------- */
const bgF = $('#bgF'), bgS = $('#bgS'), sun = $('#sun'), hills = $('#hills'), kund = $('#kund'), ring = $('#ring');
ring.insertAdjacentHTML('afterbegin', [...Array(7)].map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 7; return `<i style="transform:translate(${Math.cos(a) * 112}px,${Math.sin(a) * 112}px)"></i>`; }).join(''));
const clamp = x => x < 0 ? 0 : x > 1 ? 1 : x; let fireW = 0;
function update() {
  const ch = chapters(); let k = -1; ch.forEach((c, i) => { if (c.getBoundingClientRect().top < innerHeight * .55) k = i; }); dys.forEach((d, i) => d.classList.toggle('lit', i <= k)); $('#lab').textContent = k >= 0 ? `${k + 1} / 7 · ${ch[k].dataset.t}` : '';
  const ph = $('#phere'), vd = $('#vidai'); if (!$('#rest').classList.contains('open')) { fireW = 0; bgF.style.opacity = bgS.style.opacity = sun.style.opacity = hills.style.opacity = kund.style.opacity = 0; $('#bgY').style.opacity = $('#bgO').style.opacity = 0; return; }
  const pr = ph.getBoundingClientRect(), vr = vd.getBoundingClientRect(), H = innerHeight;
  const sunW = clamp((H * .95 - vr.top) / (H * .6));
  const fr = document.querySelector('#rest .ch[data-t="Friday"]'), frTop = fr.getBoundingClientRect().top + scrollY, phTop = pr.top + scrollY, st = frTop - H * .6, en = phTop - H * .3, warm = clamp((scrollY - st) / (en - st));
  const ss = (a, b, x) => { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };
  $('#bgY').style.opacity = ss(0, .4, warm); $('#bgO').style.opacity = ss(.35, .72, warm);
  fireW = ss(.68, 1, warm) * (1 - sunW);
  bgF.style.opacity = fireW; kund.style.opacity = fireW; bgS.style.opacity = sunW; hills.style.opacity = sunW;
  const rise = clamp((H * .6 - vr.top) / (H * 1.2)); sun.style.top = (H * (.95 - .3 * rise) - 0.8 * Math.max(innerWidth, H)) + 'px'; sun.style.opacity = sunW; const ry = $('#rays'); ry.style.top = sun.style.top; ry.style.marginTop = (-0.3 * Math.max(innerWidth, H)) + 'px'; ry.style.opacity = sunW * .9; $('#mist').style.opacity = sunW; $('#birds').style.opacity = sunW; window.__sunW = sunW; window.__fireW = fireW; if (typeof setDuck === 'function') { const gr = $('#game').getBoundingClientRect(); setDuck(!found && gr.top < innerHeight * .75 && gr.bottom > innerHeight * .25); } $('#track').classList.toggle('dayt', sunW > .5 || (scrollY - innerHeight * .28) / (innerHeight * .72) < .5);
  const rp = clamp((H * .8 - ring.getBoundingClientRect().top) / (H * .6));[...ring.querySelectorAll('i')].forEach((d, i) => d.classList.toggle('on', rp * 7 > i + .3));
}
addEventListener('scroll', update, { passive: true }); setInterval(() => { if (typeof doliUpd === 'function') doliUpd(); }, 500); addEventListener('resize', update);

/* dawn birds */
const bc = $('#birds'), bx = bc.getContext('2d'); function rsB() { bc.width = innerWidth * DPR; bc.height = innerHeight * DPR; } rsB(); addEventListener('resize', rsB);
const FL = [...Array(7)].map((_, i) => ({ dx: i * 22 + (i % 2) * 10, dy: (i % 3) * 12 + i * 4, ph: i }));
(function bl(ts) {
  const t = ts / 1000; if (document.hidden || (window.__sunW || 0) <= .02) { bx.clearRect(0, 0, bc.width, bc.height); setTimeout(() => requestAnimationFrame(bl), saveGPU ? 120 : 80); return; } const cyc = (t % 16) / 16, W = bc.width, Hh = bc.height; bx.clearRect(0, 0, W, Hh); bx.strokeStyle = '#2F4420'; bx.lineWidth = 1.8 * DPR; bx.lineCap = 'round';
  for (const o of FL) { const x = -80 * DPR + cyc * (W + 200 * DPR) + o.dx * DPR, y = Hh * .28 - cyc * Hh * .08 + o.dy * DPR, w = Math.sin(t * 9 + o.ph) * 4 * DPR; bx.beginPath(); bx.moveTo(x - 7 * DPR, y + w); bx.quadraticCurveTo(x - 3 * DPR, y - 2 * DPR, x, y + DPR); bx.quadraticCurveTo(x + 3 * DPR, y - 2 * DPR, x + 7 * DPR, y + w); bx.stroke(); } requestAnimationFrame(bl);
})(0);

/* ---------- final: music, doli, calendar, maps, countdown, share ---------- */
const music = $('#music'), mBtn = $('#musicBtn');
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2400); }
const shloka = $('#shloka'); let musicOn = false, onMain = false; const VOL = .7;
function ramp(el, to, ms) { cancelAnimationFrame(el._r); const from = el.volume, t0 = performance.now(); (function f(n) { const q = Math.max(0, Math.min(1, (n - t0) / ms)); el.volume = Math.max(0, Math.min(1, from + (to - from) * q)); if (q < 1) el._r = requestAnimationFrame(f); else if (to === 0) el.pause(); })(t0); }
const cur = () => onMain ? music : shloka;
let ducked = false; function setDuck(d) { if (d === ducked) return; ducked = d; if (!musicOn) return; ramp(cur(), d ? .22 : VOL, 900); }
/* the shloka carries the blessings chapter; the wedding song takes over from the invitation on */
function setTrack(main) {
  if (!musicOn || main === onMain) return; onMain = main;
  const on = main ? music : shloka, off = main ? shloka : music;
  on.volume = 0; const p = on.play(); if (p && p.catch) p.catch(() => { });
  ramp(on, ducked ? .22 : VOL, 1800); ramp(off, 0, 1800);
}
const ICON_ON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M11 5 L6 9 H3 v6 h3 l5 4 V5z"/><path d="M15.5 8.5 a4 4 0 0 1 0 7"/><path d="M18 6 a7 7 0 0 1 0 12"/></svg>`;
const ICON_OFF = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M11 5 L6 9 H3 v6 h3 l5 4 V5z"/><path d="M22 9 L16 15 M16 9 L22 15"/></svg>`;
function setMuteUI(on) { mBtn.hidden = false; mBtn.innerHTML = on ? ICON_ON : ICON_OFF; mBtn.style.opacity = on ? 1 : .55; mBtn.setAttribute('aria-label', on ? 'Mute music' : 'Unmute music'); mBtn.setAttribute('aria-pressed', String(!on)); }
function startMusic() {
  musicOn = true; setMuteUI(true); $('#shareBtn').hidden = false;
  shloka.muted = false; shloka.volume = 0;
  let kicked = false;
  const begin = () => { if (kicked) return; kicked = true; const p = shloka.play(); if (p && p.then) p.then(() => { ramp(shloka, VOL, 900); music.preload = 'auto'; try { music.load(); } catch (_) { } }).catch(() => { kicked = false; musicOn = false; setMuteUI(false); }); };
  begin();
  if (shloka.readyState < 2) { const go = () => { shloka.removeEventListener('canplay', go); shloka.removeEventListener('canplaythrough', go); begin(); }; shloka.addEventListener('canplay', go); shloka.addEventListener('canplaythrough', go); try { shloka.load(); } catch (_) { } }
}

mBtn.addEventListener('click', () => { const el = cur(); if (musicOn) { musicOn = false; music.pause(); shloka.pause(); setMuteUI(false); } else { musicOn = true; el.volume = ducked ? .22 : VOL; const p = el.play(); if (p && p.catch) p.catch(() => { }); setMuteUI(true); } });
shloka.addEventListener('error', () => { if (!onMain) setTrack(true); });
music.addEventListener('error', () => {/* keep mute control visible even if a track fails */ });
const HOTEL = 'Hotel Sagar View, Galu, Barsar, Distt. Hamirpur, Himachal Pradesh', HOME = 'V.P.O. Kanoh, Ward No. 3, Tehsil Barsar, Distt. Hamirpur, Himachal Pradesh';
const EVS = [['Ladies Sangeet', '2026-12-10T13:30Z', 1, HOME], ['Cocktail · DJ Night · Dine', '2026-12-10T14:00Z', 3.5, HOME], ['Lunch', '2026-12-11T07:00Z', 2, HOME], ['Sehra Bandi', '2026-12-11T10:30Z', 2, HOME], ['Departure of Barat', '2026-12-11T12:30Z', 1, HOME], ['Vadhu Pravesh', '2026-12-12T02:30Z', 1.5, HOME], ['Dhaam', '2026-12-12T07:00Z', 3, HOME]];
const fmt = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
EVS.forEach((e, i) => {
  const st = new Date(e[1]), en = new Date(st.getTime() + e[2] * 3600e3); e.st = st; e.en = en;
  const u = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e[0] + ' — Anshul & Gunjan')}&dates=${fmt(st)}/${fmt(en)}&details=${encodeURIComponent('With love, the Sharma family. RSVP: 94181 31673')}&location=${encodeURIComponent(e[3])}&ctz=Asia/Kolkata`;
  document.querySelectorAll(`.calb[data-ev="${i}"]`).forEach(a => a.href = u);
});
$('#icsBtn').addEventListener('click', () => {
  const esc = t => t.replace(/[,;]/g, m => '\\' + m); let ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Anshul weds Gunjan//EN\r\n';
  EVS.forEach((e, i) => { ics += `BEGIN:VEVENT\r\nUID:aw-g-${i}@anshul-weds-gunjan\r\nDTSTAMP:${fmt(new Date())}\r\nDTSTART:${fmt(e.st)}\r\nDTEND:${fmt(e.en)}\r\nSUMMARY:${esc(e[0] + ' — Anshul & Gunjan')}\r\nLOCATION:${esc(e[3])}\r\nBEGIN:VALARM\r\nTRIGGER:-PT2H\r\nACTION:DISPLAY\r\nDESCRIPTION:${esc(e[0])}\r\nEND:VALARM\r\nEND:VEVENT\r\n`; }); ics += 'END:VCALENDAR\r\n';
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'Anshul-weds-Gunjan.ics'; document.body.appendChild(a); a.click(); a.remove(); toast('Calendar file downloaded'); } catch (e) { toast('Use the calendar buttons beside each event'); }
});
const mq = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
const HOMEMAP = 'https://maps.app.goo.gl/Tj6Totaqz9ZoMhPc9?g_st=ac', HOTELMAP = 'https://maps.app.goo.gl/mfVY46TGdJ3F27E5A?g_st=ac';
$('#mapH1').href = $('#mapH2').href = $('#mapR').href = HOMEMAP; $('#mapB').href = $('#mapV').href = HOTELMAP;
$('#wa').href = 'https://wa.me/919418131673?text=' + encodeURIComponent("Namaste! 🙏 We'd love to join Anshul & Gunjan's wedding celebrations.\nName: \nNumber of guests: ");
$('#shareBtn').addEventListener('click', async () => { const d = { title: 'Anshul weds Gunjan', text: "You're invited to the wedding of Anshul & Gunjan — 10–12 December 2026, Barsar 💚", url: location.href }; try { if (navigator.share) await navigator.share(d); else { await navigator.clipboard.writeText(location.href); toast('Link copied'); } } catch (e) { } });
const target_t = Date.UTC(2026, 11, 11, 12, 30, 0); function tick() {
  let x = Math.max(0, Math.floor((target_t - Date.now()) / 1000)); const D = Math.floor(x / 86400); x %= 86400; const Hh = Math.floor(x / 3600); x %= 3600; const M = Math.floor(x / 60), S = x % 60;
  $('#cdD').textContent = D; $('#cdH').textContent = String(Hh).padStart(2, '0'); $('#cdM').textContent = String(M).padStart(2, '0'); $('#cdS').textContent = String(S).padStart(2, '0');
} tick(); setInterval(tick, 1000);
// doli walks across the dawn as you scroll
const doli = $('#doli'); function doliUpd() { }
(function walk(ts) {
  const on = $('#rest').classList.contains('open') && (window.__sunW || 0) > .02; if (!on) { doli.style.opacity = 0; setTimeout(() => requestAnimationFrame(walk), saveGPU ? 160 : 100); return; } const rv = $('#rsvpCh'), rt = rv ? rv.getBoundingClientRect().top : 1e9, fade = Math.max(0, Math.min(1, (rt - innerHeight * .5) / (innerHeight * .3))); doli.style.opacity = window.__sunW * fade;
  const w = doli.getBoundingClientRect().width, cyc = 15000, p = (ts % cyc) / cyc; doli.style.transform = `translateX(${-w * .85 + p * (innerWidth + w * 1.7)}px)`;
  requestAnimationFrame(walk);
})(0);
addEventListener('scroll', doliUpd, { passive: true }); addEventListener('resize', doliUpd);
/* ---------- fire ---------- */
const fcv = $('#fire'), f = fcv.getContext('2d'); function rsF() { fcv.width = innerWidth * DPR; fcv.height = innerHeight * DPR; } rsF(); addEventListener('resize', rsF);
const R = rnd(3), FP = [...Array(saveGPU ? 28 : 70)].map(() => ({ o: R(), x: (R() - .5), s: .6 + R() * .8, sp: .6 + R() * .6 }));
const PT = [...Array(saveGPU ? 8 : 18)].map(() => ({ x: R(), y: R(), s: .6 + R() * .8, v: .02 + R() * .03, r: R() * 6, c: ['#F29F05', '#E8590C', '#8FAE5A', '#FFD35C'][Math.floor(R() * 4)] }));
const pc = $('#pet'), pp = pc.getContext('2d'); function rsP() { pc.width = innerWidth * DPR; pc.height = innerHeight * DPR; } rsP(); addEventListener('resize', rsP);
function loop(ts) {
  if (document.hidden || $('#gate')) { setTimeout(() => requestAnimationFrame(loop), 160); return; } const active = (window.__fireW || 0) > .01 || (window.__sunW || 0) > .02; if (!active) { f.clearRect(0, 0, fcv.width, fcv.height); pp.clearRect(0, 0, pc.width, pc.height); setTimeout(() => requestAnimationFrame(loop), saveGPU ? 140 : 90); return; } const t = ts / 1000, Wc = fcv.width, Hc = fcv.height, u = DPR; f.clearRect(0, 0, Wc, Hc);
  if (fireW > 0.01) {
    f.globalAlpha = fireW; const cx = Wc / 2, base = Hc - 70 * u;
    let g0 = f.createRadialGradient(cx, base - 40 * u, 0, cx, base - 40 * u, 160 * u); g0.addColorStop(0, 'rgba(255,170,60,.35)'); g0.addColorStop(1, 'rgba(255,90,30,0)'); f.fillStyle = g0; f.fillRect(0, 0, Wc, Hc);
    f.globalCompositeOperation = 'lighter';
    for (const [ox, hs, ph] of [[-26, .9, 0], [24, .85, 1.7], [-8, 1.25, 3.1], [10, 1.05, 4.4], [0, 1.5, 5.3]]) {
      const h = (110 + 22 * Math.sin(t * 5 + ph)) * hs * u, w = (26 + 4 * Math.sin(t * 7 + ph)) * u, x0 = cx + ox * u, sw = Math.sin(t * 4.2 + ph) * 14 * u, sw2 = Math.sin(t * 6.3 + ph * 1.7) * 10 * u;
      const gr = f.createLinearGradient(0, base, 0, base - h); gr.addColorStop(0, 'rgba(255,245,200,.95)'); gr.addColorStop(.3, 'rgba(255,190,70,.85)'); gr.addColorStop(.7, 'rgba(240,90,30,.55)'); gr.addColorStop(1, 'rgba(200,40,20,0)');
      f.fillStyle = gr; f.beginPath(); f.moveTo(x0 - w, base); f.bezierCurveTo(x0 - w * 1.1, base - h * .35, x0 - w * .3 + sw2, base - h * .6, x0 + sw, base - h); f.bezierCurveTo(x0 + w * .4 + sw2, base - h * .6, x0 + w * 1.1, base - h * .35, x0 + w, base); f.closePath(); f.fill();
    }
    for (const q of FP) { const life = ((t * q.sp * .7 + q.o) % 1), x = cx + q.x * 50 * u + Math.sin(t * 3 + q.o * 30) * 10 * u * life, y = base - 40 * u - life * 230 * u * q.s; f.fillStyle = `rgba(255,${180 - life * 100 | 0},60,${(1 - life) * .9})`; f.beginPath(); f.arc(x, y, (1.6 * (1 - life) + .6) * u, 0, 6.283); f.fill(); }
    f.globalCompositeOperation = 'source-over'; f.globalAlpha = 1;
  }
  pp.clearRect(0, 0, pc.width, pc.height); if (!$('#gate')) { for (const q of PT) { const y = ((q.y + t * q.v) % 1) * pc.height, x = (q.x + Math.sin(t * .5 + q.r) * .03) * pc.width; pp.save(); pp.translate(x, y); pp.rotate(q.r + t); pp.scale(1, .5 + .5 * Math.sin(t * 2 + q.r)); pp.fillStyle = q.c; pp.globalAlpha = .7; pp.beginPath(); pp.ellipse(0, 0, 5 * q.s * u, 3 * q.s * u, 0, 0, 6.283); pp.fill(); pp.restore(); } }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
// observe flourishes after entry
const _io = io; io = function () { _io(); document.querySelectorAll('main .fl-orn').forEach(el => { if (el.offsetParent !== null) dio.observe(el); }); };
