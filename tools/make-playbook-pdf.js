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
const APP_URL = 'https://claude.ai/artifact/PCzQrtL9SHw2UAFQ9rsC2y';

// What makes each play different from "run your route, QB throws to whoever is open".
const SPECIAL = {
  'bubble-wrap': { tags: [], note: 'QB throws it fast. The two right-side WRs block for the RB.' },
  'lightning': { tags: ['Right or Left'], note: 'Call "Lightning Right" or "Lightning Left": the side with 3 WRs. Left is the mirror image of this picture.' },
  'fireworks': { tags: ['Block, then pop out'], note: 'RB blocks first ("one-Mississippi, two"). Nobody rushing her? She pops out short as option 3.' },
  'emily-sandwich': { tags: ['Pass to a woman'], note: 'Call it right after a guy-to-guy catch. Both options are women.' },
  'slingshot': { tags: ['Toss'], note: 'QB tosses it underhand to the RB right away.' },
  'zoom': { tags: ['Motion'], note: 'Before the hike, the inside left WR runs sideways behind the line. Hike when she reaches the QB, then hand it to her on the run.' },
  'houdini': { tags: ['Fake'], note: 'QB fakes the toss right, keeps the ball and runs left. Guys can\'t run past the line, so a woman must play QB.' },
  'emily-squared': { tags: ['Handoff', 'Lead blocker'], note: 'QB hands it to the back RB. The front RB runs ahead and blocks for her.' }
};

function render(args) {
  const { SPECIAL, APP_URL } = args;
  const P = window.Playbook;
  const NS = 'http://www.w3.org/2000/svg';
  const INK = '#0C2340';
  const FILL = { w: '#FFC93C', m: '#6EC1FF', q: '#FFFFFF' };

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
    const svg = el('svg', { viewBox: '0 28 360 314', preserveAspectRatio: 'xMidYMid meet' });
    el('rect', { x: 0, y: 28, width: 360, height: 314, fill: '#FFFFFF' }, svg);
    for (let y = P.LOS - 250; y < 345; y += 50) {
      if (((y - P.LOS) / 50) % 2 === 0) el('rect', { x: 0, y: y, width: 360, height: 50, fill: '#F1F5F0' }, svg);
    }
    for (let i = 1; i <= 4; i++) el('line', { x1: 0, x2: 360, y1: P.LOS - i * 50, y2: P.LOS - i * 50, stroke: '#D5DCD3', 'stroke-width': 1 }, svg);
    el('line', { x1: 0, x2: 360, y1: P.LOS, y2: P.LOS, stroke: '#2B6CB0', 'stroke-width': 2.5 }, svg);

    const routes = el('g', {}, svg);
    const extras = el('g', {}, svg);
    const dots = el('g', {}, svg);

    // Ball handoffs and tosses (run plays): a dotted line from the QB to where the carrier gets it.
    (play.options ? [] : play.events || []).forEach(e => {
      if (e.to === 'QB') return;
      const a = P.posAt(play, 'QB', e.t), b = P.posAt(play, e.to, e.t + e.f);
      el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#8B4A1F', 'stroke-width': 2.5, 'stroke-dasharray': '1 5', 'stroke-linecap': 'round' }, extras);
    });
    // Fakes: a dotted gray line from the QB toward the player being faked to.
    (play.pops || []).forEach(pp => {
      if (pp.text.indexOf('FAKE') !== 0) return;
      const a = P.home(play, pp.at), b = P.posAt(play, 'B', pp.t + 0.35);
      el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#6B7785', 'stroke-width': 2, 'stroke-dasharray': '1 5', 'stroke-linecap': 'round' }, extras);
      label(extras, (a[0] + b[0]) / 2 + 4, (a[1] + b[1]) / 2 + 20, 'FAKE', '#6B7785');
    });

    P.DRAW.forEach(k => {
      const pl = play.players[k];
      if (!pl || !pl.p) return;
      const pts = P.pts(play, k);
      const a = pts[pts.length - 2], b = pts[pts.length - 1];
      const bold = P.isBold(play, k);
      if (bold) {
        el('polyline', { points: poly(pts), fill: 'none', stroke: INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, routes);
        arrow(routes, a, b, INK, 11);
        if (pl.hold) {
          // Blocks first at this spot, then releases.
          const hp = pts[pl.hold[0] + 1], prev = pts[pl.hold[0]];
          tBar(routes, prev, hp, INK, 3.5);
        }
      } else if (lengthOf(pts) < 60) {
        el('polyline', { points: poly(pts), fill: 'none', stroke: '#6B7785', 'stroke-width': 2, 'stroke-linecap': 'round' }, routes);
        tBar(routes, a, b, '#6B7785', 2.5);
      } else {
        el('polyline', { points: poly(pts), fill: 'none', stroke: '#8F9AA6', 'stroke-width': 1.8, 'stroke-dasharray': '6 4', 'stroke-linejoin': 'round' }, routes);
        arrow(routes, a, b, '#8F9AA6', 8);
      }
      if (pl.start != null && pl.start < play.snap) {
        const s = P.home(play, k);
        label(extras, s[0], s[1] + 28, 'MOTION', INK);
      }
    });

    P.DRAW.forEach(k => {
      const s = P.home(play, k), g = P.gender(play, k);
      const grp = el('g', { transform: 'translate(' + s[0] + ' ' + s[1] + ')' }, dots);
      el('circle', { r: 14, fill: FILL[g], stroke: INK, 'stroke-width': 2 }, grp);
      const lb = (play.labels && play.labels[k]) || P.POS[k].label;
      const t = el('text', { 'text-anchor': 'middle', y: lb.length > 1 ? 4 : 5, 'font-size': lb.length > 1 ? 10.5 : 14, 'font-weight': 800, fill: INK, 'font-family': 'Archivo, sans-serif' }, grp);
      t.textContent = lb;
      const oi = P.optIndex(play, k);
      if (oi >= 0) {
        el('circle', { cx: 13, cy: -13, r: 9, fill: '#E87722', stroke: INK, 'stroke-width': 1.5 }, grp);
        const n = el('text', { x: 13, y: -9, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#FFFFFF', 'font-family': 'Archivo, sans-serif' }, grp);
        n.textContent = oi + 1;
      }
    });
    return svg;
  }

  function card(play) {
    const sp = SPECIAL[play.id] || { tags: [], note: '' };
    const c = h('section', 'card');
    const head = h('div', 'head');
    head.appendChild(h('h2', 'name', play.name));
    const tags = h('div', 'tags');
    tags.appendChild(h('span', 'tag ' + play.type, play.type === 'pass' ? 'Pass' : 'Run'));
    if (play.qb === 'woman') tags.appendChild(h('span', 'tag warn', 'Woman QB only'));
    if (play.setup) tags.appendChild(h('span', 'tag', 'Lineup change'));
    sp.tags.forEach(t => tags.appendChild(h('span', 'tag', t)));
    head.appendChild(tags);
    c.appendChild(head);

    const d = h('div', 'diagram');
    d.appendChild(diagram(play));
    c.appendChild(d);

    const notes = h('div', 'notes');
    if (play.setup) {
      const p = h('p', 'setup');
      p.appendChild(h('b', null, 'Lineup change: '));
      p.appendChild(document.createTextNode(play.setup));
      notes.appendChild(p);
    }
    if (play.options) {
      const ol = h('ol', 'opts');
      play.options.forEach((o, i) => {
        const li = h('li');
        li.appendChild(h('span', 'n', String(i + 1)));
        const txt = h('span');
        txt.appendChild(h('b', null, P.nameOf(play, o.to)));
        txt.appendChild(document.createTextNode(': ' + o.what));
        li.appendChild(txt);
        ol.appendChild(li);
      });
      notes.appendChild(ol);
    } else {
      let carrier = null;
      for (const k in play.players) if (play.players[k].kind === 'ball') carrier = k;
      if (carrier) {
        const p = h('p');
        p.appendChild(h('b', null, 'Ball goes to: '));
        p.appendChild(document.createTextNode(P.nameOf(play, carrier)));
        notes.appendChild(p);
      }
    }
    if (sp.note) notes.appendChild(h('p', 'special', sp.note));
    c.appendChild(notes);
    return c;
  }

  function sheet(type, titleText) {
    const s = h('div', 'sheet');
    const top = h('header', 'top');
    const left = h('div');
    left.appendChild(h('p', 'eyebrow', 'Coed 8v8 Flag Playbook'));
    left.appendChild(h('h1', null, titleText));
    const legend = h('div', 'legend');
    [['w', 'Woman'], ['m', 'Man'], ['q', 'QB (anyone)']].forEach(([g, t]) => {
      const it = h('span');
      const sw = h('i', 'sw ' + g);
      it.appendChild(sw);
      it.appendChild(document.createTextNode(t));
      legend.appendChild(it);
    });
    legend.appendChild(h('span', null, 'L = lineman (blocks)'));
    legend.appendChild(h('span', null, 'Dark line = can get the ball'));
    legend.appendChild(h('span', null, 'Orange number = QB looks here 1st, 2nd…'));
    legend.appendChild(h('span', null, 'Gray dashes = decoy route'));
    legend.appendChild(h('span', null, '⊥ = block'));
    left.appendChild(legend);
    top.appendChild(left);
    const qr = h('div', 'qr');
    if (window.qrcode) {
      const q = window.qrcode(0, 'M');
      q.addData(APP_URL);
      q.make();
      qr.innerHTML = q.createSvgTag({ cellSize: 3, margin: 0, scalable: true });
      qr.appendChild(h('p', null, 'Scan to watch them move'));
    }
    top.appendChild(qr);
    s.appendChild(top);
    const grid = h('div', 'grid');
    P.PLAYS.filter(p => p.type === type).slice(0, 4).forEach(p => grid.appendChild(card(p)));
    s.appendChild(grid);
    return s;
  }

  const css = `
    @page { size: Letter; margin: 0.35in; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; color: ${INK}; font-family: Archivo, "Helvetica Neue", Arial, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .sheet { width: 7.8in; height: 10.3in; display: flex; flex-direction: column; gap: 0.12in; page-break-after: always; break-after: page; overflow: hidden; }
    .sheet:last-child { page-break-after: auto; break-after: auto; }
    .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.2in; }
    .eyebrow { margin: 0; font-size: 9pt; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #E87722; }
    h1 { margin: 0.02in 0 0.06in; font-family: Barlow, Archivo, sans-serif; font-weight: 800; font-size: 30pt; line-height: 1; }
    .legend { display: flex; flex-wrap: wrap; gap: 0.04in 0.16in; font-size: 8.5pt; font-weight: 600; color: #3A4A5E; max-width: 6.2in; }
    .legend span { display: inline-flex; align-items: center; gap: 0.05in; }
    .sw { width: 0.13in; height: 0.13in; border-radius: 50%; border: 1.5px solid ${INK}; display: inline-block; }
    .sw.w { background: ${FILL.w}; } .sw.m { background: ${FILL.m}; } .sw.q { background: #fff; }
    .qr { width: 1in; text-align: center; flex: none; }
    .qr svg { width: 0.9in; height: 0.9in; display: block; margin: 0 auto; }
    .qr p { margin: 0.03in 0 0; font-size: 7pt; font-weight: 700; line-height: 1.2; }
    .grid { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 0.14in; }
    .card { border: 2px solid ${INK}; border-radius: 0.12in; padding: 0.1in 0.12in 0.1in; display: flex; flex-direction: column; min-height: 0; overflow: hidden; }
    .head { display: flex; flex-direction: column; gap: 0.04in; }
    .name { margin: 0; font-family: Barlow, Archivo, sans-serif; font-weight: 800; font-size: 24pt; line-height: 1; }
    .tags { display: flex; flex-wrap: wrap; gap: 0.04in; }
    .tag { font-size: 7.5pt; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; padding: 0.02in 0.07in; border-radius: 999px; border: 1.5px solid ${INK}; }
    .tag.pass { background: ${FILL.m}; } .tag.run { background: ${FILL.w}; }
    .tag.warn { background: #E87722; color: #fff; border-color: #E87722; }
    .diagram { flex: 1; min-height: 0; margin: 0.07in 0 0.05in; border: 1px solid #D5DCD3; border-radius: 0.06in; overflow: hidden; }
    .diagram svg { width: 100%; height: 100%; display: block; }
    .notes { font-size: 8.5pt; line-height: 1.3; display: flex; flex-direction: column; gap: 0.04in; }
    .notes p { margin: 0; }
    .special { font-weight: 700; }
    .opts { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.02in; }
    .opts li { display: flex; gap: 0.05in; align-items: baseline; }
    .opts .n { flex: none; width: 0.16in; height: 0.16in; border-radius: 50%; background: #E87722; color: #fff; font-weight: 800; font-size: 7.5pt; display: inline-grid; place-items: center; transform: translateY(0.02in); }
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
  try {
    await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js' });
  } catch (err) {
    console.warn('QR code library did not load; the sheets will print without a QR code.');
  }
  await page.evaluate(render, { SPECIAL, APP_URL });
  await page.evaluate(() => document.fonts.ready);
  const out = process.argv[2] || path.join(ROOT, 'playbook.pdf');
  await page.pdf({ path: out, format: 'Letter', printBackground: true, preferCSSPageSize: true });
  if (process.argv[3]) await page.screenshot({ path: process.argv[3], fullPage: true });
  await browser.close();
  console.log('Wrote ' + out);
})();
