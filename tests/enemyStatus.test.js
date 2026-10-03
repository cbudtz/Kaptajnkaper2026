import { describe, expect, it } from 'vitest';
import { KaperGameHost } from '../src/game/host/KaperGameHost.js';
import { AttackType, EnemyState } from '../src/game/constants/enums.js';

describe('EnemyModel.checkEnemyStatus', () => {
  it('transitions to WON_SURRENDER when crew is below 20', () => {
    const host = new KaperGameHost();
    const enemy = host.attack.currentEnemy;
    enemy.men = 15;
    enemy.currentState = EnemyState.GOOD;
    enemy.cannons = 5;
    enemy.reparation = 100;

    enemy.checkEnemyStatus();

    expect(enemy.getCurrentState()).toBe(EnemyState.SURRENDER);
    expect(host.attack.getCurrentAttack()).toBe(AttackType.WON_SURRENDER);
  });

  it('stays GOOD when crew is still 20 or more', () => {
    const host = new KaperGameHost();
    const enemy = host.attack.currentEnemy;
    enemy.men = 25;
    enemy.currentState = EnemyState.GOOD;

    enemy.checkEnemyStatus();

    expect(enemy.getCurrentState()).toBe(EnemyState.GOOD);
    expect(host.attack.getCurrentAttack()).toBe(AttackType.NONE);
  });
});
