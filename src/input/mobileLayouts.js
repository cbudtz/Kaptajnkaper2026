import { getLabelText } from '../game/text/getLabelText.js';

/** @typedef {{ key: string, label: string, repeat?: boolean, primary?: boolean }} MobileButton */

/** @typedef {{ caption?: string, rows?: MobileButton[][], toolbar?: MobileButton[], dpad?: (string|null)[][] }} MobileLayout */

/** Numpad-style compass: 7–9 top, 4/6 middle, 1–3 bottom; center is decorative only. */
export const NAVIGATION_DPAD = [
  ['7', '8', '9'],
  ['4', null, '6'],
  ['1', '2', '3'],
];

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
    dpad: NAVIGATION_DPAD,
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
  'play-attack-initial': {
    rows: [
      [
        { key: 'a', label: 'Angrib (a)', primary: true },
        { key: 'f', label: 'Flygt (f)', primary: true },
      ],
    ],
  },
  'play-attack-tactic': {
    rows: [
      [
        { key: 'b', label: 'Bordér (b)', primary: true },
        { key: 's', label: 'Skyd (s)', primary: true },
      ],
    ],
  },
  'play-attack-shoot': {
    toolbar: [
      { key: 'f', label: 'Ild!' },
      { key: '0', label: 'Tilbage' },
    ],
    dpad: NAVIGATION_DPAD,
  },
  'play-attack-board': {
    rows: [
      [
        { key: 'k', label: 'Kæmp (k)', primary: true },
        { key: 't', label: 'Træk (t)', primary: true },
      ],
    ],
  },
  'play-attack-wait': {
    rows: [[{ key: ' ', label: '…', primary: true }]],
  },
  'play-attack-surrender': {
    rows: [
      [
        { key: 'p', label: 'Prise (p)', primary: true },
        { key: 's', label: 'Sænk (s)', primary: true },
      ],
    ],
  },
  'play-attack-continue': {
    rows: [[{ key: ' ', label: 'Fortsæt', primary: true }]],
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

/** Center cell of navigation d-pad (decorative compass rose). */
export const COMPASS_ROSE_SVG = `<svg class="mobile-dpad-compass-svg" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <circle cx="40" cy="40" r="34" fill="#101080" stroke="#ccccff" stroke-width="3"/>
  <circle cx="40" cy="40" r="24" fill="none" stroke="#8888ff" stroke-width="1.5" opacity="0.85"/>
  <line x1="40" y1="10" x2="40" y2="70" stroke="#aaaaff" stroke-width="2"/>
  <line x1="10" y1="40" x2="70" y2="40" stroke="#aaaaff" stroke-width="2"/>
  <line x1="18" y1="18" x2="62" y2="62" stroke="#6666cc" stroke-width="1"/>
  <line x1="62" y1="18" x2="18" y2="62" stroke="#6666cc" stroke-width="1"/>
  <polygon points="40,8 46,22 34,22" fill="#ffcc44" stroke="#fff8cc" stroke-width="1"/>
  <text x="40" y="30" text-anchor="middle" fill="#ffee99" font-size="14" font-weight="800" font-family="system-ui,sans-serif">N</text>
  <text x="54" y="44" text-anchor="middle" fill="#dde" font-size="11" font-weight="700" font-family="system-ui,sans-serif">Ø</text>
  <text x="40" y="58" text-anchor="middle" fill="#dde" font-size="11" font-weight="700" font-family="system-ui,sans-serif">S</text>
  <text x="26" y="44" text-anchor="middle" fill="#dde" font-size="11" font-weight="700" font-family="system-ui,sans-serif">V</text>
  <circle cx="40" cy="40" r="4" fill="#ccccff"/>
</svg>`;

export function createCompassRoseElement() {
  const spacer = document.createElement('div');
  spacer.className = 'mobile-dpad-spacer mobile-dpad-compass';
  spacer.setAttribute('aria-hidden', 'true');
  spacer.innerHTML = COMPASS_ROSE_SVG;
  return spacer;
}

/** @param {string} panelId */
export function resolveMobileLayout(panelId) {
  if (panelId === 'play-attack-initial') {
    const a = getLabelText('AttackY').charAt(0);
    const f = getLabelText('AttackN').charAt(0);
    return {
      rows: [
        [
          { key: a, label: `Angrib (${a})`, primary: true },
          { key: f, label: `Flygt (${f})`, primary: true },
        ],
      ],
    };
  }
  if (panelId === 'play-attack-tactic') {
    const b = getLabelText('AttackTypeB').charAt(0);
    const s = getLabelText('AttackTypeS').charAt(0);
    return {
      rows: [
        [
          { key: b, label: `Bordér (${b})`, primary: true },
          { key: s, label: `Skyd (${s})`, primary: true },
        ],
      ],
    };
  }
  if (panelId === 'play-attack-shoot') {
    const fire = getLabelText('ShootTypeF').charAt(0);
    const withdraw = getLabelText('ShootTypeW').charAt(0);
    return {
      toolbar: [
        { key: fire, label: 'Ild!' },
        { key: withdraw, label: 'Tilbage' },
      ],
      dpad: NAVIGATION_DPAD,
    };
  }
  if (panelId === 'play-attack-board') {
    const fight = getLabelText('BoardTypeF').charAt(0);
    const withdraw = getLabelText('BoardTypeW').charAt(0);
    return {
      rows: [
        [
          { key: fight, label: `Kæmp (${fight})`, primary: true },
          { key: withdraw, label: `Træk (${withdraw})`, primary: true },
        ],
      ],
    };
  }
  if (panelId === 'play-attack-surrender') {
    const prize = getLabelText('AttackSurrenderP').charAt(0);
    const sink = getLabelText('AttackSurrenderS').charAt(0);
    return {
      rows: [
        [
          { key: prize, label: `Prise (${prize})`, primary: true },
          { key: sink, label: `Sænk (${sink})`, primary: true },
        ],
      ],
    };
  }
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
          grid.appendChild(createCompassRoseElement());
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
