/**
 * oklyn-card — behaviour tests.  Run with:  node test/run.mjs
 *
 * Covers the three spots that break silently: what the metric tiles show when
 * the Oklyn probe drops (entity gone, or present with a non-numeric state),
 * the pH/RedOx colour thresholds in both colour modes, and the editor's
 * config-changed contract (CustomEvent.detail is a readonly accessor — a
 * regression there discards every edit without an error).
 *
 * The card keeps a built ha-card and updates it through this.querySelector,
 * so unlike dosing-tank-card the wholesale markup dump is useless here. Each
 * instance gets persistent per-selector slots instead: what _update() writes
 * is what we assert on. CARD_PATH lets CI or a proof run point the same suite
 * at another build of the card.
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadCard, check, contains, report } from './harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const CARD = process.env.CARD_PATH || join(HERE, '..', 'dist', 'oklyn-card.js');
const registry = await loadCard(CARD);
const Card   = registry.get('oklyn-card');
const Editor = registry.get('oklyn-card-editor');

// Same formatter as _metricHtml, so assertions hold in any Node locale.
const fmt = (n) => n.toLocaleString();

// ── Per-selector slots ───────────────────────────────────────────────────────

function makeSlot() {
  const classes = new Set();
  return {
    textContent: '', innerHTML: '', hidden: false, checked: false,
    classes,
    classList: {
      toggle: (k, force) => {
        const on = force === undefined ? !classes.has(k) : !!force;
        on ? classes.add(k) : classes.delete(k);
      },
      add: (k) => classes.add(k), remove: (k) => classes.delete(k),
      contains: (k) => classes.has(k),
    },
  };
}

/** Card wired to a hass state; returns the slots _update() wrote into. */
function renderCard(config, states) {
  const c = new Card();
  c.setConfig(config);
  const slots = new Map();
  c.querySelector = (sel) => {
    if (!slots.has(sel)) slots.set(sel, makeSlot());
    return slots.get(sel);
  };
  c.querySelectorAll = () => [];
  c.hass = { states, locale: { language: 'en' } };
  return slots;
}

/** The tile whose label matches, split into { cls, value }. */
function tile(slots, label) {
  const html = slots.get('#okl-metrics')?.innerHTML ?? '';
  const seg = html.split('<div class="okl-metric')
    .find((s) => s.includes('>' + label + '</div>'));
  if (!seg) return { cls: '(tuile absente)', value: '(tuile absente)' };
  return {
    cls:   (seg.match(/okl-value ([a-z-]*)/) || [, ''])[1].trim(),
    value: (seg.match(/okl-value [^"]*">([^<]*)</) || [, '(?)'])[1],
    unavailable: seg.includes('okl-unavailable'),
  };
}

const BASE = {
  model: 'analysis',
  ph_entity: 'sensor.ph', orp_entity: 'sensor.orp',
  water_entity: 'sensor.water', air_entity: 'sensor.air',
};
const st = (v, attrs = {}) => ({ state: String(v), attributes: attrs, last_updated: '2026-08-12T10:00:00Z' });

// ── Probe dropout ────────────────────────────────────────────────────────────
// The Oklyn probe drops in two distinct ways: HA removes the entity, or keeps
// it with a non-numeric state ("unavailable"/"unknown"). Both must show an
// em-dash without a colour, never a numeric-looking artefact.

{
  const slots = renderCard(BASE, { 'sensor.orp': st(650) });   // no sensor.ph
  const ph = tile(slots, 'pH');
  check('entité pH absente → tiret (—)', ph.value.trim(), '—');
  check('entité pH absente → grisée', ph.unavailable, true);
}

{
  const slots = renderCard(BASE, { 'sensor.ph': st('unavailable'), 'sensor.orp': st(650) });
  const ph = tile(slots, 'pH');
  check('état "unavailable" → pas de NaN affiché', ph.value.includes('NaN'), false);
  check('état "unavailable" → pas de classe couleur', ph.cls, '');
}

// ── Colour thresholds (mode "threshold") ─────────────────────────────────────
// Defaults: pH 6.8–7.6, RedOx 550–800. Below → blue, inside → green (bounds
// included), above → orange.

{
  const s = (ph) => tile(renderCard(BASE, { 'sensor.ph': st(ph) }), 'pH').cls;
  check('pH 6.5 < min → bleu',   s(6.5), 'okl-blue');
  check('pH 7.2 dans la zone → vert', s(7.2), 'okl-ok');
  check('pH 6.8 borne min incluse → vert', s(6.8), 'okl-ok');
  check('pH 7.9 > max → orange', s(7.9), 'okl-warn');
}

{
  const s = (mv) => tile(renderCard(BASE, { 'sensor.orp': st(mv) }), 'RedOx').cls;
  check('RedOx 500 < min → bleu',  s(500), 'okl-blue');
  check('RedOx 650 dans la zone → vert', s(650), 'okl-ok');
  check('RedOx 850 > max → orange', s(850), 'okl-warn');
}

// pH offset: the colour must follow the corrected value, not the raw one.
{
  const slots = renderCard({ ...BASE, ph_offset: -0.99 }, { 'sensor.ph': st(8.34) });
  const ph = tile(slots, 'pH corrected');
  check('offset −0.99 : 8.34 affiché corrigé', ph.value.trim(), fmt(7.35));
  check('offset −0.99 : couleur sur la valeur corrigée', ph.cls, 'okl-ok');
}

// ── Colour mode "oklyn" (status attribute) ───────────────────────────────────
// The API status wins when present; without it the thresholds take over.

{
  const s = (status, v = 7.2) => tile(
    renderCard({ ...BASE, color_source: 'oklyn' },
               { 'sensor.ph': st(v, status ? { status } : {}) }), 'pH').cls;
  check('status low → bleu même si la valeur est en zone verte', s('low'), 'okl-blue');
  check('status high → orange', s('high'), 'okl-warn');
  check('status absent → repli sur les seuils', s(null, 6.5), 'okl-blue');
}

// ── Editor contract ──────────────────────────────────────────────────────────
// CustomEvent.detail is readonly: building the event without { detail } then
// assigning it silently drops the payload and every edit in the UI is lost.

{
  const formNodes = [];
  const realCreate = globalThis.document.createElement;
  globalThis.document.createElement = (tag) => {
    const n = realCreate(tag);
    n.listeners = {};
    n.addEventListener = (type, fn) => { n.listeners[type] = fn; };
    if (tag === 'ha-form') formNodes.push(n);
    return n;
  };

  const ed = new Editor();
  ed.setConfig({ ...BASE, ph_min: 6.8 });
  ed.hass = { states: {}, locale: { language: 'en' } };

  const form = formNodes.at(-1);
  check('l\'éditeur construit bien un ha-form', !!form, true);

  // In strict mode (any ESM card), assigning event.detail after construction
  // throws — catch it so the regression reads as failed checks, not a crash.
  let dispatchError = null;
  try {
    form?.listeners['value-changed']?.({ detail: { value: { ...BASE, ph_min: 7.0 } } });
  } catch (e) { dispatchError = e; }
  const ev = ed.events.at(-1);
  check('le handler value-changed ne lève pas', dispatchError, null);
  check('l\'éditeur émet config-changed', ev?.type, 'config-changed');
  check('config-changed porte detail.config (piège detail readonly)',
    ev?.detail?.config?.ph_min, 7.0);

  globalThis.document.createElement = realCreate;
}

report();
