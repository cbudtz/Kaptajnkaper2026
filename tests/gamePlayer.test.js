import { describe, expect, it, vi } from 'vitest';
import { GamePlayer } from '../src/game/player/GamePlayer.js';
import { CauseOfDeath, GameAction, GameStep } from '../src/game/constants/enums.js';

function createMockHost() {
  return {
    setCurrentAction: vi.fn(),
    setCurrentStep: vi.fn(),
    animationRepaint: false,
  };
}

describe('GamePlayer', () => {
  it('starts with DOS-default resources', () => {
    const player = new GamePlayer(createMockHost());
    expect(player.getMoney()).toBe(600);
    expect(player.getMen()).toBe(200);
    expect(player.getCannons()).toBe(20);
    expect(player.getGrain()).toBe(30);
    expect(player.getReparation()).toBe(200);
  });

  it('reduces crew when grain runs out', () => {
    const player = new GamePlayer(createMockHost());
    player.men = 100;
    player.setGrain(-1);
    expect(player.getGrain()).toBe(0);
    expect(player.getMen()).toBe(90);
  });

  it('sets death when reparation too low', () => {
    const host = createMockHost();
    const player = new GamePlayer(host);
    player.reparation = 15;
    player.checkPlayerStatus();
    expect(player.getDeathReason()).toBe(CauseOfDeath.TOO_FEW_RESOURCES);
    expect(host.setCurrentStep).toHaveBeenCalledWith(GameStep.GAME_LOST);
    expect(host.setCurrentAction).toHaveBeenCalledWith(GameAction.MAP);
  });
});
