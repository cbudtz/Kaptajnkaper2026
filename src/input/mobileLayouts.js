import { getLabelText } from '../game/text/getLabelText.js';

/** @typedef {{ key: string, label: string, repeat?: boolean, primary?: boolean }} MobileButton */

/** @typedef {{ caption?: string, rows?: MobileButton[][], toolbar?: MobileButton[], dpad?: (string|null)[][] }} MobileLayout */

/** @type {Record<string, MobileLayout>} */
export const MOBILE_LAYOUTS = {
  intro: {
    caption: 'Tryk Fortsæt eller på skærmen for at starte',
    rows: [
      [{ key: ' ', label: 'Fortsæt', primary: true }],
      [
        { key: 'e', label: 'Engelsk' },
        { key: 'c', label: 'Slet rekord' },
      ],
    ],
  },
  sound: {
    caption: 'Vælg lyd ved start (som DOS-spillet)',
    rows: [
      [
        { key: '0', label: '0 — Stilhed', primary: true },
        { key: '1', label: '1 — Lydeffekter', primary: true },
      ],
      [{ key: 'F2', label: 'F2 — skift lyd senere' }],
    ],
  },
  name: {
    caption: 'Skriv kaptajnens navn og tryk OK',
    rows: [
      [{ key: 'Backspace', label: 'Slet tegn' }],
      [{ key: 'Enter', label: 'OK — start spil', primary: true }],
    ],
  },
  title: {
    caption: 'Tryk Fortsæt for at gå videre',
    rows: [[{ key: ' ', label: 'Fortsæt', primary: true }]],
  },
  'play-map': {
    toolbar: [
      { key: 'F1', label: 'Hjælp' },
      { key: 'F2', label: 'Lyd' },
      { key: 'Escape', label: 'Afslut' },
    ],
    dpad: [
      ['7', '8', '9'],
      ['4', '2', '6'],
      ['1', null, '3'],
    ],
  },
  'play-harbor': {
    caption: 'Styr ind i havnen (venstre / højre)',
    rows: [
      [
        { key: '4', label: '← Venstre', repeat: true, primary: true },
        { key: '6', label: 'Højre →', repeat: true, primary: true },
      ],
      [{ key: ' ', label: 'Fortsæt' }],
    ],
  },
  'play-attack': {
    caption: 'Angrib eller flygt — brug tal under kanonkamp',
    rows: [
      [
        { key: 'a', label: 'Angrib', primary: true },
        { key: 'f', label: 'Flygt', primary: true },
      ],
      [
        { key: '1', label: '1' },
        { key: '2', label: '2' },
        { key: '3', label: '3' },
        { key: '4', label: '4' },
        { key: '5', label: '5' },
        { key: '6', label: '6' },
      ],
      [
        { key: 'Enter', label: 'Enter' },
        { key: 'Escape', label: 'Esc' },
        { key: 'j', label: 'Ja' },
        { key: 'n', label: 'Nej' },
      ],
    ],
  },
  'play-city': {
    caption: 'By — vælg handling (1–6)',
    rows: [
      [
        { key: '1', label: '1' },
        { key: '2', label: '2' },
        { key: '3', label: '3' },
        { key: '4', label: '4' },
        { key: '5', label: '5' },
        { key: '6', label: '6' },
      ],
      [{ key: 'F1', label: 'F1 Hjælp' }],
    ],
  },
  'play-city-amount': {
    caption: 'Indtast antal (0–9) og tryk OK',
    rows: [
      [
        { key: '1', label: '1' },
        { key: '2', label: '2' },
        { key: '3', label: '3' },
        { key: '4', label: '4' },
        { key: '5', label: '5' },
      ],
      [
        { key: '6', label: '6' },
        { key: '7', label: '7' },
        { key: '8', label: '8' },
        { key: '9', label: '9' },
        { key: '0', label: '0' },
      ],
      [
        { key: 'Backspace', label: 'Slet' },
        { key: 'Enter', label: 'OK', primary: true },
      ],
    ],
  },
  'play-city-error': {
    caption: 'Fejl — tryk Fortsæt',
    rows: [[{ key: ' ', label: 'Fortsæt', primary: true }]],
  },
  'play-menu': {
    caption: 'Vælg med tal 1–6',
    rows: [
      [
        { key: '1', label: '1' },
        { key: '2', label: '2' },
        { key: '3', label: '3' },
        { key: '4', label: '4' },
        { key: '5', label: '5' },
        { key: '6', label: '6' },
      ],
      [
        { key: 'F1', label: 'Hjælp' },
        { key: 'Enter', label: 'Enter' },
        { key: 'Escape', label: 'Esc' },
        { key: 'j', label: 'Ja' },
        { key: 'n', label: 'Nej' },
      ],
    ],
  },
  end: {
    caption: 'Tryk Fortsæt',
    rows: [[{ key: ' ', label: 'Fortsæt', primary: true }]],
  },
};

const DPAD_LABELS = {
  '1': '↙',
  '2': '↓',
  '3': '↘',
  '4': '←',
  '6': '→',
  '7': '↖',
  '8': '↑',
  '9': '↗',
};

/** @param {string} panelId */
export function resolveMobileLayout(panelId) {
  if (panelId === 'play-city-sell') {
    const cannons = getLabelText('CitySellC').charAt(0);
    const grain = getLabelText('CitySellG').charAt(0);
    const jewels = getLabelText('CitySellJ').charAt(0);
    return {
      caption: 'Vælg hvad du vil sælge',
      rows: [
        [
          { key: cannons, label: `Kanoner (${cannons})` },
          { key: grain, label: `Korn (${grain})` },
          { key: jewels, label: `Juveler (${jewels})` },
        ],
        [{ key: 'F1', label: 'F1 Hjælp' }],
      ],
    };
  }
  return MOBILE_LAYOUTS[panelId] ?? MOBILE_LAYOUTS.end;
}

/**
 * @param {MobileLayout} layout
 * @param {HTMLElement} deck
 */
export function renderMobileDeck(layout, deck) {
  deck.replaceChildren();

  if (layout.toolbar?.length) {
    const rowEl = document.createElement('div');
    rowEl.className = 'mobile-deck-row mobile-deck-toolbar';
    for (const btn of layout.toolbar) {
      rowEl.appendChild(createMobileButton(btn));
    }
    deck.appendChild(rowEl);
  }

  if (layout.dpad) {
    const grid = document.createElement('div');
    grid.className = 'mobile-dpad-grid';
    for (const row of layout.dpad) {
      for (const key of row) {
        if (key === null) {
          const spacer = document.createElement('div');
          spacer.className = 'mobile-dpad-spacer';
          spacer.setAttribute('aria-hidden', 'true');
          grid.appendChild(spacer);
          continue;
        }
        grid.appendChild(
          createMobileButton({
            key,
            label: DPAD_LABELS[key] ?? key,
            repeat: true,
          }),
        );
      }
    }
    deck.appendChild(grid);
    return;
  }

  for (const row of layout.rows ?? []) {
    const rowEl = document.createElement('div');
    rowEl.className = 'mobile-deck-row';
    for (const btn of row) {
      rowEl.appendChild(createMobileButton(btn));
    }
    deck.appendChild(rowEl);
  }
}

/** @param {MobileButton} spec */
function createMobileButton(spec) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'mobile-btn';
  if (spec.primary) b.classList.add('primary');
  if (spec.repeat) b.classList.add('repeat');
  b.dataset.key = spec.key;
  b.textContent = spec.label;
  return b;
}
