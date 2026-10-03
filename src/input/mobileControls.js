import { GameStep, GameAction } from '../game/constants/enums.js';

/** @typedef {{ step: number, action: number }} GameUiState */

let lastUiPanel = '';

/**
 * @param {() => GameUiState} getState
 */
function panelForState(getState) {
  const { step, action } = getState();

  if (step === GameStep.INTRO_WELCOME) return 'intro';
  if (step === GameStep.INTRO_SOUND) return 'sound';
  if (step === GameStep.INTRO_ENTER_NAME) return 'name';
  if (step === GameStep.TITLE_SCREEN) return 'title';
  if (step === GameStep.GAME_PLAYING) {
    if (action === GameAction.MAP) return 'play-map';
    if (action === GameAction.HARBOR || action === GameAction.CITY) return 'play-harbor';
    return 'play-menu';
  }
  return 'end';
}

/**
 * @param {(event: { key: string, preventDefault: () => void, stopPropagation?: () => void }) => void} handleKey
 * @param {() => GameUiState} getState
 * @param {{ setPlayerName?: (name: string) => void, getPlayerName?: () => string }} [playerBridge]
 */
export function bindMobileControls(handleKey, getState, playerBridge = {}) {
  const ui = document.getElementById('mobile-ui');
  if (!ui || !getState) return;

  const hint = document.getElementById('mobile-hint');
  const nameWrap = document.getElementById('mobile-name-wrap');
  const nameInput = document.getElementById('mobile-name-input');

  const dispatch = (key) => {
    handleKey({
      key,
      preventDefault: () => {},
      stopPropagation: () => {},
    });
    if (hint) hint.classList.remove('visible');
    syncMobileUi(getState, nameWrap, nameInput, playerBridge);
  };

  let repeatTimer = null;
  const clearRepeat = () => {
    if (repeatTimer) {
      clearInterval(repeatTimer);
      repeatTimer = null;
    }
  };

  ui.querySelectorAll('button[data-key]').forEach((btn) => {
    const key = btn.getAttribute('data-key');
    if (!key) return;

    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      dispatch(key);
      if (btn.classList.contains('repeat')) {
        clearRepeat();
        repeatTimer = setInterval(() => dispatch(key), 120);
      }
    });
    btn.addEventListener('pointerup', clearRepeat);
    btn.addEventListener('pointercancel', clearRepeat);
    btn.addEventListener('pointerleave', clearRepeat);
  });

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
      const panel = panelForState(getState);
      if (panel === 'intro' || panel === 'title' || panel === 'sound') {
        dispatch(' ');
      }
    },
    { passive: false },
  );

  syncMobileUi(getState, nameWrap, nameInput, playerBridge);

  return () => syncMobileUi(getState, nameWrap, nameInput, playerBridge);
}

/**
 * @param {() => GameUiState} getState
 */
export function syncMobileUi(getState, nameWrap, nameInput, playerBridge) {
  const ui = document.getElementById('mobile-ui');
  if (!ui) return;

  const panel = panelForState(getState);
  ui.querySelectorAll('.mobile-panel').forEach((el) => {
    el.classList.toggle('active', el.dataset.panel === panel);
  });

  const onName = panel === 'name';
  if (nameWrap) nameWrap.classList.toggle('active', onName);
  if (onName && nameInput) {
    const current = playerBridge.getPlayerName?.() ?? '';
    if (nameInput.value !== current) nameInput.value = current;
    if (panel !== lastUiPanel && panel === 'name') {
      setTimeout(() => nameInput.focus(), 100);
    }
  }
  lastUiPanel = panel;

  const hint = document.getElementById('mobile-hint');
  if (hint && !hint.dataset.dismissed) {
    const messages = {
      intro: 'Tryk Fortsæt eller på skærmen for at starte',
      sound: 'Vælg 0 (stilhed) eller 1 (lydeffekter)',
      name: 'Skriv dit navn og tryk OK',
      title: 'Tryk Fortsæt for at gå videre',
      'play-map': 'Brug pilene til at sejle — F1 hjælp, F2 lyd',
      'play-harbor': 'Venstre/højre (4/6) i havnen',
      'play-menu': 'Tal 1–6 eller Enter / Esc som i spillet',
      end: 'Tryk Fortsæt',
    };
    hint.textContent = messages[panel] ?? '';
    hint.classList.add('visible');
  }
}

/** Call after render / key handling */
export function refreshMobileUi(getState, playerBridge) {
  const nameWrap = document.getElementById('mobile-name-wrap');
  const nameInput = document.getElementById('mobile-name-input');
  syncMobileUi(getState, nameWrap, nameInput, playerBridge);
}
