import { getMobilePanelForState } from './mobileUiState.js';
import { MOBILE_LAYOUTS, renderMobileDeck } from './mobileLayouts.js';

/** @typedef {import('./mobileUiState.js').GameUiState} GameUiState */

let lastUiPanel = '';
let repeatTimer = null;

export function isMobileShellEnabled() {
  if (typeof window === 'undefined') return false;
  return (
    document.documentElement.classList.contains('touch-device')
    || window.matchMedia('(hover: none), (pointer: coarse), (max-width: 900px)').matches
  );
}

export function initMobileShell() {
  if ('ontouchstart' in globalThis || navigator.maxTouchPoints > 0) {
    document.documentElement.classList.add('touch-device');
  }
  const relayout = () => {
    document.documentElement.style.setProperty(
      '--mobile-deck-height',
      `${Math.round(Math.min(Math.max(window.innerHeight * 0.42, 200), 480))}px`,
    );
  };
  relayout();
  window.addEventListener('resize', relayout);
  window.visualViewport?.addEventListener('resize', relayout);

  if (isMobileShellEnabled()) {
    const ui = document.getElementById('mobile-ui');
    if (ui) ui.hidden = false;
  }
}

/**
 * @param {(event: { key: string, preventDefault: () => void, stopPropagation?: () => void }) => void} handleKey
 * @param {() => GameUiState} getState
 * @param {{ setPlayerName?: (name: string) => void, getPlayerName?: () => string, onNameChanged?: () => void }} [playerBridge]
 */
export function bindMobileControls(handleKey, getState, playerBridge = {}) {
  const ui = document.getElementById('mobile-ui');
  const deck = document.getElementById('mobile-deck');
  if (!ui || !deck || !getState) return;

  const nameBlock = document.getElementById('mobile-name-block');
  const nameInput = document.getElementById('mobile-name-input');

  const clearRepeat = () => {
    if (repeatTimer) {
      clearInterval(repeatTimer);
      repeatTimer = null;
    }
  };

  const dispatch = (key) => {
    handleKey({
      key,
      preventDefault: () => {},
      stopPropagation: () => {},
    });
    const hint = document.getElementById('mobile-hint');
    hint?.classList.remove('visible');
    syncMobileUi(getState, nameBlock, nameInput, playerBridge);
  };
  deck.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('button[data-key]');
    if (!btn || !deck.contains(btn)) return;
    e.preventDefault();
    const key = btn.getAttribute('data-key');
    if (!key) return;
    dispatch(key);
    if (btn.classList.contains('repeat')) {
      clearRepeat();
      repeatTimer = setInterval(() => dispatch(key), 120);
    }
  });
  deck.addEventListener('pointerup', clearRepeat);
  deck.addEventListener('pointercancel', clearRepeat);
  deck.addEventListener('pointerleave', clearRepeat);

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      playerBridge.setPlayerName?.(nameInput.value);
      playerBridge.onNameChanged?.();
    });
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        dispatch('Enter');
      }
    });
  }

  const gameContainer = document.getElementById('game-container');
  gameContainer?.addEventListener(
    'pointerdown',
    (e) => {
      if (e.target.closest('#mobile-ui')) return;
      const panel = getMobilePanelForState(getState());
      if (panel === 'intro' || panel === 'title' || panel === 'sound') {
        dispatch(' ');
      }
    },
    { passive: false },
  );

  syncMobileUi(getState, nameBlock, nameInput, playerBridge);

  return () => syncMobileUi(getState, nameBlock, nameInput, playerBridge);
}

/**
 * @param {() => GameUiState} getState
 */
export function syncMobileUi(getState, nameBlock, nameInput, playerBridge) {
  const ui = document.getElementById('mobile-ui');
  const deck = document.getElementById('mobile-deck');
  const caption = document.getElementById('mobile-caption');
  if (!ui || !deck) return;

  if (!isMobileShellEnabled()) {
    ui.hidden = true;
    return;
  }
  ui.hidden = false;

  const panel = getMobilePanelForState(getState());
  const layout = MOBILE_LAYOUTS[panel] ?? MOBILE_LAYOUTS.end;

  if (panel !== lastUiPanel) {
    renderMobileDeck(layout, deck);
    if (caption) caption.textContent = layout.caption ?? '';
  } else if (caption && caption.textContent !== (layout.caption ?? '')) {
    caption.textContent = layout.caption ?? '';
  }

  const onName = panel === 'name';
  if (nameBlock) nameBlock.hidden = !onName;
  if (onName && nameInput) {
    const current = playerBridge.getPlayerName?.() ?? '';
    if (nameInput.value !== current) nameInput.value = current;
    if (panel !== lastUiPanel) {
      setTimeout(() => nameInput.focus(), 100);
    }
  }

  lastUiPanel = panel;

  const hint = document.getElementById('mobile-hint');
  if (hint && !hint.dataset.dismissed && layout.caption) {
    hint.textContent = layout.caption;
    hint.classList.add('visible');
  }
}

/** Call after render / key handling */
export function refreshMobileUi(getState, playerBridge) {
  const nameBlock = document.getElementById('mobile-name-block');
  const nameInput = document.getElementById('mobile-name-input');
  syncMobileUi(getState, nameBlock, nameInput, playerBridge);
}
