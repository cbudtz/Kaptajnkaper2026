import { describe, expect, it } from 'vitest';
import { getMobilePanelForState } from '../src/input/mobileUiState.js';
import { GameAction, GameStep } from '../src/game/constants/enums.js';

describe('getMobilePanelForState', () => {
  it('maps intro steps to intro panels', () => {
    expect(getMobilePanelForState({ step: GameStep.INTRO_WELCOME, action: 0 })).toBe('intro');
    expect(getMobilePanelForState({ step: GameStep.INTRO_SOUND, action: 0 })).toBe('sound');
    expect(getMobilePanelForState({ step: GameStep.INTRO_ENTER_NAME, action: 0 })).toBe('name');
    expect(getMobilePanelForState({ step: GameStep.TITLE_SCREEN, action: 0 })).toBe('title');
  });

  it('maps gameplay actions to play panels', () => {
    expect(
      getMobilePanelForState({ step: GameStep.GAME_PLAYING, action: GameAction.MAP }),
    ).toBe('play-map');
    expect(
      getMobilePanelForState({ step: GameStep.GAME_PLAYING, action: GameAction.HARBOR }),
    ).toBe('play-harbor');
    expect(
      getMobilePanelForState({ step: GameStep.GAME_PLAYING, action: GameAction.ATTACK }),
    ).toBe('play-menu');
  });

  it('maps end screens to end panel', () => {
    expect(getMobilePanelForState({ step: GameStep.GAME_LOST, action: 0 })).toBe('end');
    expect(getMobilePanelForState({ step: GameStep.HIGHSCORE, action: 0 })).toBe('end');
  });
});
