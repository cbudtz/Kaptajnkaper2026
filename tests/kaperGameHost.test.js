import { describe, expect, it } from 'vitest';
import { KaperGameHost } from '../src/game/host/KaperGameHost.js';
import { GameStep } from '../src/game/constants/enums.js';
import { setGameSoundEnabled } from '../src/game/audio/soundState.js';

function key(k) {
  return { key: k, preventDefault: () => {} };
}

describe('KaperGameHost intro flow', () => {
  it('walks welcome → sound → title → name → play', () => {
    setGameSoundEnabled(true);
    const host = new KaperGameHost();
    expect(host.currentStep).toBe(GameStep.INTRO_WELCOME);

    host.handleKey(key(' '));
    expect(host.currentStep).toBe(GameStep.INTRO_SOUND);

    host.handleKey(key('1'));
    expect(host.currentStep).toBe(GameStep.TITLE_SCREEN);

    host.handleKey(key(' '));
    expect(host.currentStep).toBe(GameStep.INTRO_ENTER_NAME);

    host.handleKey(key('a'));
    host.handleKey(key('b'));
    host.handleKey(key('Enter'));
    expect(host.currentStep).toBe(GameStep.GAME_PLAYING);
    expect(host.getCurrentPlayer().getName()).toBe('ab');
  });
});
