import { describe, expect, it } from 'vitest';
import { KaperGameHost } from '../src/game/host/KaperGameHost.js';
import { AttackType, BoardState, GameAction, GameStep } from '../src/game/constants/enums.js';
import { getAttackMobileMode } from '../src/input/attackMobileMode.js';
import { getMobilePanelForState } from '../src/input/mobileUiState.js';

describe('attack mobile mode during boarding', () => {
  it('uses board panel while fighting on deck', () => {
    const host = new KaperGameHost();
    host.setCurrentStep(GameStep.GAME_PLAYING);
    host.setCurrentAction(GameAction.ATTACK);
    host.attack.setCurrentAttack(AttackType.BOARD);
    host.attack.getCurrentBoard().currentState = BoardState.BOARDING;

    expect(getAttackMobileMode(host.attack)).toBe('board');
    expect(getMobilePanelForState(host.getMobileUiState())).toBe('play-attack-board');
  });

  it('uses surrender panel after enemy yields', () => {
    const host = new KaperGameHost();
    host.setCurrentStep(GameStep.GAME_PLAYING);
    host.setCurrentAction(GameAction.ATTACK);
    host.attack.setCurrentAttack(AttackType.WON_SURRENDER);

    expect(getAttackMobileMode(host.attack)).toBe('surrender');
    expect(getMobilePanelForState(host.getMobileUiState())).toBe('play-attack-surrender');
  });
});
