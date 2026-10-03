import { AttackType, EnemyState } from '../constants/enums.js';

/**
 * Enemy ship state for combat encounters (ported from legacy/enemy.js).
 */
export class EnemyModel {
  /**
   * @param {import('../host/GameHost.js').GameHost} host
   * @param {import('./AttackSystem.js').AttackSystem} attack
   */
  constructor(host, attack) {
    this.host = host;
    this.currentAttack = attack;

    this.enemyType = null;
    this.money = null;
    this.cannons = null;
    this.men = null;
    this.reparation = null;
    this.grain = 0.0;

    /** Cannons, men, money, grain per ship type */
    this.typeData = [
      [5, 80, 150, 30],
      [10, 480, 600, 15],
      [2, 40, 150, 4],
      [15, 140, 450, 5],
      [6, 50, 200, 4],
      [1, 10, 30, 1],
      [50, 140, 900, 20],
      [70, 200, 1500, 12],
    ];

    this.currentState = null;
    this.prepareNextEnemy();
  }

  prepareNextEnemy() {
    this.enemyType = Math.floor(Math.random() * 8);
    this.money = this.typeData[this.enemyType][2];
    this.reparation = 100 + Math.floor(Math.random() * 50);
    this.cannons = this.typeData[this.enemyType][0];
    this.men = this.typeData[this.enemyType][1];
    this.grain = 1 + Math.round(Math.random() * this.typeData[this.enemyType][3]);
    this.currentState = EnemyState.GOOD;
  }

  checkEnemyStatus() {
    if (this.cannons < 1) this.currentState = EnemyState.SURRENDER;
    if (this.men < 20) this.currentState = EnemyState.SURRENDER;
    if (this.reparation < 40 - this.host.getCurrentPlayer().getDifficulty()) {
      this.currentState = EnemyState.SURRENDER;
    }
    if (this.reparation < 15) this.currentState = EnemyState.SUNK;

    if (this.currentState === EnemyState.SURRENDER) {
      this.currentAttack.setCurrentAttack(AttackType.WON_SURRENDER);
    } else if (this.currentState === EnemyState.SUNK) {
      this.currentAttack.setCurrentAttack(AttackType.WON_SUNK);
    }
  }

  getName() {
    return this.host.getCGAFont().getResourceAsString(`EnemyName${this.enemyType + 1}`);
  }

  getMoney() {
    return this.money;
  }

  getGrain() {
    return Math.round(this.grain);
  }

  getMen() {
    return this.men;
  }

  setMen(m) {
    this.men = Math.floor(m);
    if (this.men < 0) this.men = 0;
  }

  getCannons() {
    return this.cannons;
  }

  setCannons(c) {
    this.cannons = Math.floor(c);
    if (this.cannons < 0) this.cannons = 0;
  }

  getReparation() {
    return this.reparation;
  }

  setReparation(r) {
    this.reparation = Math.floor(r);
    if (this.reparation < 0) this.reparation = 0;
  }

  getPrizeCost() {
    return Math.floor(5 + this.men / 2);
  }

  getEnemyType() {
    return this.enemyType;
  }

  getCurrentState() {
    return this.currentState;
  }
}
