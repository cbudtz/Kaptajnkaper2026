import { GameStep } from '../game/constants/enums.js';

/**
 * Intro name on mobile: Safari sends key events to Phaser while the user types in
 * #mobile-name-input, which would append each character twice (DOM input + handleKey).
 * Only the start-of-game name step uses that field.
 *
 * @param {number} step
 * @param {Element | null | undefined} activeElement
 */
export function shouldIgnoreGameKeyboardForMobileName(step, activeElement) {
  if (step !== GameStep.INTRO_ENTER_NAME) return false;
  if (typeof document === 'undefined') return false;
  const nameInput = document.getElementById('mobile-name-input');
  return Boolean(nameInput && activeElement === nameInput);
}
