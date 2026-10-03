import { describe, expect, it } from 'vitest';
import { KaperGameHost } from '../src/game/host/KaperGameHost.js';
import { AttackType, GameAction } from '../src/game/constants/enums.js';

function key(k) {
  return { key: k, preventDefault: () => {} };
}

describe('Attack prize flow', () => {
  it('continues to map after prize confirm', () => {
    const host = new KaperGameHost();
    const attack = host.attack;
    host.setCurrentAction(GameAction.ATTACK);
    attack.setCurrentAttack(AttackType.WON_PRIZING);
    attack.currentEnemy.men = 30;

    const menBefore = host.getCurrentPlayer().getMen();
    const prizeCost = attack.currentEnemy.getPrizeCost();
    attack.keyEvent(' ');
    expect(host.getCurrentAction()).toBe(GameAction.MAP);
    expect(attack.getCurrentAttack()).toBe(AttackType.NONE);
    expect(host.getCurrentPlayer().getMen()).toBe(menBefore - prizeCost);
  });
});
