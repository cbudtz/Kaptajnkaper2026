import { describe, expect, it, vi } from 'vitest';
import { MapSystem } from '../src/game/systems/MapSystem.js';
import { GameAction } from '../src/game/constants/enums.js';
import { GamePlayer } from '../src/game/player/GamePlayer.js';

function createHost() {
  const host = {
    currentStep: 3,
    currentAction: GameAction.MAP,
    animationRepaint: false,
    setCurrentAction: vi.fn(function (a) {
      this.currentAction = a;
    }),
    setCurrentStep: vi.fn(),
    getCurrentPlayer: vi.fn(),
    getCurrentAction() {
      return this.currentAction;
    },
    getHarbor: vi.fn(() => ({ setNewHarbor: vi.fn() })),
    getCity: vi.fn(() => ({ setNewCity: vi.fn() })),
  };
  host.getCurrentPlayer.mockImplementation(() => host.player);
  host.player = new GamePlayer(host);
  return host;
}

describe('MapSystem', () => {
  it('moves on water tiles', () => {
    const host = createHost();
    const map = new MapSystem(host);
    host.player.setPosX(10);
    host.player.setPosY(10);
    map.moveShip('6');
    expect(host.player.getPosX()).toBe(11);
  });

  it('penalizes reparation when hitting land', () => {
    const host = createHost();
    const map = new MapSystem(host);
    host.player.setPosX(3);
    host.player.setPosY(3);
    host.player.setReparation(50);
    map.moveShip('4');
    expect(host.player.getReparation()).toBe(47);
  });

  it('enters harbor when moving onto city tile', () => {
    const host = createHost();
    const map = new MapSystem(host);
    host.player.setPosX(26);
    host.player.setPosY(12);
    map.moveShip('4');
    expect(host.setCurrentAction).toHaveBeenCalledWith(GameAction.HARBOR);
  });
});
