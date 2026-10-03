import { getMobilePanelForState } from './mobileUiState.js';
import { renderMobileDeck, resolveMobileLayout } from './mobileLayouts.js';
import { bindMobileViewportHandlers, resetMobileViewportZoom } from './mobileViewport.js';
import { computeMobileLayout } from './mobileLayout.js';

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

function layoutMobileShell() {
  const vv = window.visualViewport;
  const viewportWidth = Math.round(vv?.width ?? window.innerWidth);
  const viewportHeight = Math.round(vv?.height ?? window.innerHeight);
  const offsetTop = Math.round(vv?.offsetTop ?? 0);
  const offsetLeft = Math.round(vv?.offsetLeft ?? 0);
  const { gameBandHeight, deckHeight } = computeMobileLayout(viewportWidth, viewportHeight);

  const root = document.documentElement;
  root.style.setProperty('--app-height', `${viewportHeight}px`);
  root.style.setProperty('--game-band-height', `${gameBandHeight}px`);
  root.style.setProperty('--mobile-deck-height', `${deckHeight}px`);

  const shell = document.getElementById('app-shell');
  if (shell && isMobileShellEnabled()) {
    shell.style.top = `${offsetTop}px`;
    shell.style.left = `${offsetLeft}px`;
    shell.style.width = `${viewportWidth}px`;
    shell.style.height = `${viewportHeight}px`;
    shell.style.maxHeight = `${viewportHeight}px`;
    shell.style.right = 'auto';
    shell.style.bottom = 'auto';
  }

  const gameContainer = document.getElementById('game-container');
  if (gameContainer && isMobileShellEnabled()) {
    gameContainer.style.height = `${gameBandHeight}px`;
    gameContainer.style.maxHeight = `${gameBandHeight}px`;
    gameContainer.style.flex = '0 0 auto';
  }

  const ui = document.getElementById('mobile-ui');
  if (ui && isMobileShellEnabled()) {
    ui.hidden = false;
    ui.style.flex = '1 1 auto';
    ui.style.height = `${deckHeight}px`;
    ui.style.minHeight = `${deckHeight}px`;
    ui.style.maxHeight = `${deckHeight}px`;
  }

  window.dispatchEvent(new Event('kaper-mobile-layout'));
}

export function initMobileShell() {
  if ('ontouchstart' in globalThis || navigator.maxTouchPoints > 0) {
    document.documentElement.classList.add('touch-device');
  }

  layoutMobileShell();
  window.addEventListener('resize', layoutMobileShell);
  window.visualViewport?.addEventListener('resize', layoutMobileShell);
  window.visualViewport?.addEventListener('scroll', layoutMobileShell);

  bindMobileViewportHandlers();
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
    if (nameInput && document.activeElement === nameInput) {
      nameInput.blur();
      resetMobileViewportZoom();
    }
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
        nameInput.blur();
        resetMobileViewportZoom();
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
  const compactPanel =
    panel === 'play-map'
    || panel === 'play-harbor'
    || panel === 'play-attack'
    || panel === 'play-city-amount'
    || panel === 'play-city-sell';
  ui.classList.toggle('compact-deck', compactPanel);
  const layout = resolveMobileLayout(panel);

  if (panel !== lastUiPanel) {
    renderMobileDeck(layout, deck);
    deck.classList.toggle('compact', compactPanel);
  } else {
    deck.classList.toggle('compact', compactPanel);
  }

  if (caption) {
    if (compactPanel) {
      caption.hidden = true;
      caption.textContent = '';
    } else {
      caption.hidden = false;
      caption.textContent = layout.caption ?? '';
    }
  }

  const onName = panel === 'name';
  if (nameBlock) nameBlock.hidden = !onName;
  if (onName && nameInput) {
    const current = playerBridge.getPlayerName?.() ?? '';
    if (nameInput.value !== current) nameInput.value = current;
  } else if (nameInput && document.activeElement === nameInput) {
    nameInput.blur();
    resetMobileViewportZoom();
  }

  lastUiPanel = panel;

  const hint = document.getElementById('mobile-hint');
  if (hint) {
    if (
      panel === 'play-map'
      || panel === 'play-harbor'
      || panel === 'play-attack'
      || panel.startsWith('play-city')
    ) {
      hint.classList.remove('visible');
    } else if (!hint.dataset.dismissed && layout.caption) {
      hint.textContent = layout.caption;
      hint.classList.add('visible');
    }
  }
}

/** Call after render / key handling */
export function refreshMobileUi(getState, playerBridge) {
  const nameBlock = document.getElementById('mobile-name-block');
  const nameInput = document.getElementById('mobile-name-input');
  syncMobileUi(getState, nameBlock, nameInput, playerBridge);
}
