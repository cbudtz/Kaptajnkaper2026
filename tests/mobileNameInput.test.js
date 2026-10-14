import { beforeEach, describe, expect, it } from 'vitest';
import { GameStep } from '../src/game/constants/enums.js';
import { shouldIgnoreGameKeyboardForMobileName } from '../src/input/mobileNameInput.js';

describe('shouldIgnoreGameKeyboardForMobileName', () => {
  /** @type {HTMLInputElement} */
  let input;

  beforeEach(() => {
    document.body.innerHTML = '<input id="mobile-name-input" type="text" />';
    input = document.getElementById('mobile-name-input');
  });

  it('ignores Phaser keys only on intro name step when name input is focused', () => {

    expect(
      shouldIgnoreGameKeyboardForMobileName(GameStep.INTRO_ENTER_NAME, input),
    ).toBe(true);

    expect(
      shouldIgnoreGameKeyboardForMobileName(GameStep.GAME_PLAYING, input),
    ).toBe(false);

    expect(
      shouldIgnoreGameKeyboardForMobileName(GameStep.INTRO_ENTER_NAME, document.body),
    ).toBe(false);
  });
});
