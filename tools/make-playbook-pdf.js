// Builds playbook.pdf: two printable sheets (pass plays, run plays), four plays per sheet.
// The diagrams are drawn from the same play data as the app (index.html), so they stay in sync.
//
// Usage: node tools/make-playbook-pdf.js
// Needs Playwright with Chromium (npm i -g playwright, or set PLAYWRIGHT_PATH to the package).

const path = require('path');
const { execSync } = require('child_process');

const playwrightPath = process.env.PLAYWRIGHT_PATH ||
  path.join(execSync('npm root -g').toString().trim(), 'playwright');
const { chromium } = require(playwrightPath);

const ROOT = path.join(__dirname, '..');

// Words only where the picture can't say it: lineup changes, motion, fakes, calls.
const SPECIAL = {
  'bubble-wrap': { tags: [], lines: ['Lineup: outside left WR plays L'] },
  'lightning': { tags: ['Right or Left'], lines: ['Lineup: inside left WR plays L, RB plays WR', 'Call Right or Left = side with 3 WRs. Left is the mirror image.'] },
  'fireworks': { tags: ['Block, then pop out'], lines: ['Lineup: outside left WR plays L', 'RB blocks first, then pops out short.'] },
  'emily-sandwich': { tags: ['Pass to a woman'], lines: ['Lineup: RB plays L'] },
  'slingshot': { tags: ['Toss'], lines: [] },
  'zoom': { tags: ['Motion'], lines: ['Motion: WR runs sideways behind the line before the hike.'] },
  'houdini': { tags: ['Fake handoff'], lines: ['Lineup: outside left WR plays L', 'Fake handoff to the RB. QB keeps it and runs left.'] },
  'emily-squared': { tags: ['Handoff'], lines: ['Lineup: inside left WR lines up behind the RB'] }
};

function render(args) {
  const { SPECIAL } = args;
  const P = window.Playbook;
  const NS = 'http://www.w3.org/2000/svg';
  const INK = '#0C2340';
  // Colors by role, not by gender: receivers and RBs, linemen and Center, QB.
  const FILL = { skill: '#FFC93C', line: '#B7C1CC', qb: '#FFFFFF', womanQb: '#A66BE0' };
  // Squeeze the depth a little so the field is wider than tall and fills a landscape box.
  const DEPTH = 0.56;
  const Y = y => (y < P.LOS ? P.LOS - (P.LOS - y) * DEPTH : y);
  const XY = p => [p[0], Y(p[1])];
  const TOP = Y(32), BOTTOM = 342;
  function role(play, k) {
    if (k === 'QB') return play.qb === 'woman' ? 'womanQb' : 'qb';
    const lb = (play.labels && play.labels[k]) || P.POS[k].label;
    return lb === 'C' || lb === 'L' ? 'line' : 'skill';
  }

  function el(name, attrs, parent) {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function h(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  const poly = pts => pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  function lengthOf(pts) {
    let L = 0;
    for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    return L;
  }
  function endDir(a, b) {
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1;
    return [dx / L, dy / L];
  }
  function arrow(g, a, b, color, size) {
    const [dx, dy] = endDir(a, b), px = -dy, py = dx;
    el('polygon', { points: poly([[b[0] + dx * 3, b[1] + dy * 3],
      [b[0] - dx * size + px * size * 0.6, b[1] - dy * size + py * size * 0.6],
      [b[0] - dx * size - px * size * 0.6, b[1] - dy * size - py * size * 0.6]]), fill: color }, g);
  }
  function tBar(g, a, b, color, width) {
    const [dx, dy] = endDir(a, b), px = -dy, py = dx;
    el('line', { x1: b[0] + px * 9, y1: b[1] + py * 9, x2: b[0] - px * 9, y2: b[1] - py * 9, stroke: color, 'stroke-width': width, 'stroke-linecap': 'round' }, g);
  }
  function label(g, x, y, text, color) {
    const t = el('text', { x: x, y: y, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: color, 'font-family': 'Archivo, sans-serif', 'letter-spacing': 0.5 }, g);
    t.textContent = text;
  }

  function diagram(play) {
    const svg = el('svg', { viewBox: '0 ' + TOP + ' 360 ' + (BOTTOM - TOP), preserveAspectRatio: 'xMidYMid meet' });
    el('rect', { x: 0, y: TOP, width: 360, height: BOTTOM - TOP, fill: '#FFFFFF' }, svg);
    for (let i = -2; i <= 4; i++) {
      const y0 = Y(P.LOS - (i + 1) * 50), y1 = Y(P.LOS - i * 50);
      if (i % 2 === 0) el('rect', { x: 0, y: y0, width: 360, height: y1 - y0, fill: '#F1F5F0' }, svg);
    }
    for (let i = 1; i <= 4; i++) el('line', { x1: 0, x2: 360, y1: Y(P.LOS - i * 50), y2: Y(P.LOS - i * 50), stroke: '#D5DCD3', 'stroke-width': 1 }, svg);
    el('line', { x1: 0, x2: 360, y1: P.LOS, y2: P.LOS, stroke: '#2B6CB0', 'stroke-width': 2.5 }, svg);

    const routes = el('g', {}, svg);
    const extras = el('g', {}, svg);
    const dots = el('g', {}, svg);
    const over = el('g', {}, svg);

    // Ball handoffs and tosses (run plays): a dotted line from the QB to where the carrier gets it.
    (play.options ? [] : play.events || []).forEach(e => {
      if (e.to === 'QB') return;
      const a = XY(P.posAt(play, 'QB', e.t)), b = XY(P.posAt(play, e.to, e.t + e.f));
      el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#8B4A1F', 'stroke-width': 2.5, 'stroke-dasharray': '1 5', 'stroke-linecap': 'round' }, extras);
    });
    // Fakes: a dotted gray line from the QB toward the player being faked to.
    (play.pops || []).forEach(pp => {
      if (pp.text.indexOf('FAKE') !== 0) return;
      const a = XY(P.home(play, pp.at)), b = XY(P.posAt(play, 'B', pp.t + 0.6));
      el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#6B7785', 'stroke-width': 2.5, 'stroke-dasharray': '1 5', 'stroke-linecap': 'round' }, extras);
      // Label sits right under the QB, who is the one faking.
      const tag = el('g', { transform: 'translate(' + a[0] + ' ' + (a[1] + 29) + ')' }, over);
      el('rect', { x: -50, y: -9, width: 100, height: 18, rx: 9, fill: '#FFFFFF', stroke: INK, 'stroke-width': 1.5 }, tag);
      label(tag, 0, 4, 'FAKE HANDOFF', INK);
    });

    P.DRAW.forEach(k => {
      const pl = play.players[k];
      if (!pl || !pl.p) return;
      if (k === 'QB' && !P.isBold(play, k)) return;
      const pts = P.pts(play, k).map(XY);
      const a = pts[pts.length - 2], b = pts[pts.length - 1];
      const bold = P.isBold(play, k);
      if (bold) {
        el('polyline', { points: poly(pts), fill: 'none', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, routes);
        arrow(routes, a, b, INK, 12);
        if (pl.hold) {
          // Blocks first at this spot, then releases.
          const hp = pts[pl.hold[0] + 1], prev = pts[pl.hold[0]];
          tBar(routes, prev, hp, INK, 4);
        }
      } else if (lengthOf(pts) < 60) {
        el('polyline', { points: poly(pts), fill: 'none', stroke: '#6B7785', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, routes);
        tBar(routes, a, b, '#6B7785', 3);
      } else {
        el('polyline', { points: poly(pts), fill: 'none', stroke: '#8F9AA6', 'stroke-width': 2.2, 'stroke-dasharray': '7 5', 'stroke-linejoin': 'round' }, routes);
        arrow(routes, a, b, '#8F9AA6', 9);
      }
      if (pl.start != null && pl.start < play.snap) {
        const s = XY(P.home(play, k));
        label(over, s[0], s[1] + 30, 'MOTION', INK);
      }
    });

    P.DRAW.forEach(k => {
      const s = XY(P.home(play, k)), r = role(play, k);
      const grp = el('g', { transform: 'translate(' + s[0] + ' ' + s[1] + ')' }, dots);
      el('circle', { r: 15, fill: FILL[r], stroke: INK, 'stroke-width': 2 }, grp);
      const lb = (play.labels && play.labels[k]) || P.POS[k].label;
      const t = el('text', { 'text-anchor': 'middle', y: lb.length > 1 ? 4.5 : 5.5, 'font-size': lb.length > 1 ? 12 : 15, 'font-weight': 800, fill: r === 'womanQb' ? '#FFFFFF' : INK, 'font-family': 'Archivo, sans-serif' }, grp);
      t.textContent = lb;
      const oi = P.optIndex(play, k);
      if (oi >= 0) {
        el('circle', { cx: 14, cy: -14, r: 10, fill: '#E87722', stroke: INK, 'stroke-width': 1.5 }, grp);
        const n = el('text', { x: 14, y: -9.5, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#FFFFFF', 'font-family': 'Archivo, sans-serif' }, grp);
        n.textContent = oi + 1;
      }
    });
    return svg;
  }

  function card(play) {
    const sp = SPECIAL[play.id] || { tags: [], lines: [] };
    const c = h('section', 'card');
    const head = h('div', 'head');
    head.appendChild(h('h2', 'name', play.name));
    const tags = h('div', 'tags');
    if (play.qb === 'woman') tags.appendChild(h('span', 'tag wqb', 'Woman QB'));
    sp.tags.forEach(t => tags.appendChild(h('span', 'tag', t)));
    head.appendChild(tags);
    c.appendChild(head);

    const d = h('div', 'diagram');
    d.appendChild(diagram(play));
    c.appendChild(d);

    if (sp.lines.length) {
      const notes = h('div', 'notes');
      sp.lines.forEach(t => notes.appendChild(h('p', null, t)));
      c.appendChild(notes);
    }
    return c;
  }

  function sheet(type, titleText) {
    const s = h('div', 'sheet ' + type);
    const top = h('header', 'top');
    top.appendChild(h('h1', null, titleText));
    const plays = P.PLAYS.filter(p => p.type === type).slice(0, 4);
    const legend = h('div', 'legend');
    const keys = [['skill', 'WR / RB'], ['line', 'C / L (line)'], ['qb', 'QB']];
    if (plays.some(p => p.qb === 'woman')) keys.push(['womanQb', 'Woman QB']);
    keys.forEach(([r, t]) => {
      const it = h('span');
      const sw = h('i', 'sw');
      sw.style.background = FILL[r];
      it.appendChild(sw);
      it.appendChild(document.createTextNode(t));
      legend.appendChild(it);
    });
    if (plays.some(p => p.options)) {
      const num = h('span');
      num.appendChild(h('i', 'num', '1'));
      num.appendChild(document.createTextNode('QB looks here first'));
      legend.appendChild(num);
    }
    legend.appendChild(h('span', null, '⊥ block'));
    top.appendChild(legend);
    s.appendChild(top);
    const grid = h('div', 'grid');
    plays.forEach(p => grid.appendChild(card(p)));
    s.appendChild(grid);
    return s;
  }

  const css = `
    @page { size: Letter landscape; margin: 0.3in; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; color: ${INK}; font-family: Archivo, "Helvetica Neue", Arial, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .sheet { width: 10.4in; height: 7.9in; display: flex; flex-direction: column; gap: 0.1in; page-break-after: always; break-after: page; overflow: hidden; }
    .sheet:last-child { page-break-after: auto; break-after: auto; }
    .sheet.pass { --page: #1F5FAF; }
    .sheet.run { --page: #E2650F; }
    .top { display: flex; align-items: center; gap: 0.3in; height: 0.75in; padding: 0 0.12in 0 0.2in; border-radius: 0.12in; background: var(--page); color: #fff; }
    h1 { margin: 0; font-family: Barlow, Archivo, sans-serif; font-weight: 800; font-size: 34pt; line-height: 1; letter-spacing: 0.02em; text-transform: uppercase; white-space: nowrap; }
    .legend { flex: 1; display: flex; flex-wrap: wrap; align-items: center; gap: 0.06in 0.2in; font-size: 10pt; font-weight: 700; }
    .legend span { display: inline-flex; align-items: center; gap: 0.06in; }
    .sw { width: 0.18in; height: 0.18in; border-radius: 50%; border: 1.5px solid #fff; display: inline-block; }
    .num { width: 0.2in; height: 0.2in; border-radius: 50%; background: #E87722; color: #fff; border: 1.5px solid #fff; font-style: normal; font-weight: 800; font-size: 9pt; display: inline-grid; place-items: center; }
    .grid { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 0.14in; }
    .card { border: 3px solid var(--page); border-radius: 0.12in; padding: 0.08in 0.12in; display: flex; flex-direction: column; min-height: 0; overflow: hidden; }
    .head { display: flex; align-items: center; justify-content: space-between; gap: 0.1in; }
    .name { margin: 0; font-family: Barlow, Archivo, sans-serif; font-weight: 800; font-size: 26pt; line-height: 1; white-space: nowrap; }
    .tags { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0.05in; }
    .tag { font-size: 9pt; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; padding: 0.03in 0.09in; border-radius: 999px; border: 1.5px solid ${INK}; white-space: nowrap; }
    .tag.pass { background: ${INK}; color: #fff; } .tag.run { background: ${INK}; color: #fff; }
    .tag.wqb { background: ${FILL.womanQb}; border-color: ${FILL.womanQb}; color: #fff; }
    .diagram { flex: 1; min-height: 0; margin-top: 0.06in; }
    .diagram svg { width: 100%; height: 100%; display: block; }
    .notes { margin-top: 0.04in; font-size: 10.5pt; font-weight: 700; line-height: 1.25; }
    .notes p { margin: 0; }
  `;

  document.title = 'Coed 8v8 Flag Playbook';
  const style = document.createElement('style');
  style.textContent = css;
  document.querySelectorAll('style').forEach(s => s.remove());
  document.head.appendChild(style);
  document.body.innerHTML = '';
  document.body.appendChild(sheet('pass', 'Pass Plays'));
  document.body.appendChild(sheet('run', 'Run Plays'));
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.join(ROOT, 'index.html'));
  await page.waitForFunction(() => window.Playbook && document.fonts.ready);
  await page.evaluate(render, { SPECIAL });
  await page.evaluate(() => document.fonts.ready);
  const out = process.argv[2] || path.join(ROOT, 'playbook.pdf');
  await page.pdf({ path: out, format: 'Letter', landscape: true, printBackground: true, preferCSSPageSize: true });
  if (process.argv[3]) await page.screenshot({ path: process.argv[3], fullPage: true });
  await browser.close();
  console.log('Wrote ' + out);
})();
