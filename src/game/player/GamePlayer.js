import { CauseOfDeath, GameAction, GameStep } from '../constants/enums.js';
import { formatString } from '../../i18n/index.js';

export class GamePlayer {
  /**
   * @param {import('../host/KaperGameHost.js').KaperGameHost} host
   */
  constructor(host) {
    this.host = host;
    this.rankType1 = ['SEAMAN', 'CAPTAIN', 'LEFTENANTCOMMANDER', 'COMMANDER', 'ADMIRAL'];
    this.rankType2 = ['CITISEN', 'BARON', 'VISCOUNT', 'COUNT', 'ROYAL_HEIR'];
    this.resetPlayer();
  }

  calculateNextPromotion() {
    this.difficulty += 2;
    this.scoreToNextPromotion = this.score + 500 + 250 * this.difficulty;
    this.maxMovesBeforeNextPromotion = this.moves + 325 - Math.round(12.5 * this.difficulty);
  }

  resetPlayer() {
    this.name = '';
    this.score = 0;
    this.moves = 0;
    this.difficulty = 0;
    this.posX = 10;
    this.posY = 10;
    this.money = 600;
    this.cannons = 20;
    this.men = 200;
    this.reparation = 200;
    this.jewels = 0;
    this.grain = 30;
    this.calculateNextPromotion();
    this.eventExp = 2;
    this.battlesWon = 1;
    this.battlesLost = 1;
    this.prizeMen = 0;
    this.prizeMoney = 0;
    this.deathReason = CauseOfDeath.NOT_YET;
  }

  checkForPromotion() {
    if (this.score >= this.scoreToNextPromotion) {
      this.calculateNextPromotion();
      this.host.setCurrentAction(GameAction.PROMOTE);
    }
  }

  checkPlayerStatus() {
    if (this.money > 30000) this.deathReason = CauseOfDeath.TOO_MANY_MONEY;
    if (this.men > 500) this.deathReason = CauseOfDeath.TOO_MANY_MEN;
    if (this.cannons > 150) this.deathReason = CauseOfDeath.TOO_MANY_CANNONS;
    if (this.grain > 700) this.deathReason = CauseOfDeath.TOO_MANY_GRAIN;
    if (this.reparation <= 20 || this.men <= 10) this.deathReason = CauseOfDeath.TOO_FEW_RESOURCES;
    if (this.moves >= this.maxMovesBeforeNextPromotion) this.deathReason = CauseOfDeath.TOO_MANY_MOVES;

    if (this.deathReason !== CauseOfDeath.NOT_YET) {
      this.host.setCurrentStep(GameStep.GAME_LOST);
      this.host.setCurrentAction(GameAction.MAP);
      this.host.animationRepaint = false;
    }
  }

  collectPrizes() {
    this.score += this.prizeMoney / 10;
    this.men += this.prizeMen;
    this.money += this.prizeMoney;
    if (this.money > 30000) this.money = 30000;
    this.prizeMen = 0;
    this.prizeMoney = 0;
  }

  getName() {
    return this.name;
  }

  setName(n) {
    this.name = `${n}`.substring(0, 20);
  }

  getScore() {
    return this.score;
  }

  addToScore(p) {
    this.score += p;
  }

  getExperience() {
    return this.eventExp;
  }

  addToExperience() {
    this.eventExp += 1;
  }

  getBattlesWon() {
    return this.battlesWon;
  }

  addToBattlesWon() {
    this.battlesWon += 1;
  }

  getBattlesLost() {
    return this.battlesLost;
  }

  addToBattlesLost() {
    this.battlesLost += 1;
  }

  getMoves() {
    return this.moves;
  }

  addMove() {
    this.moves += 1;
    this.setGrain(this.grain - this.getMen() * (this.difficulty * 1.0) / 800.0);
    this.checkForPromotion();
  }

  getMoney() {
    return Math.round(this.money);
  }

  setMoney(m) {
    this.money = Math.round(m);
  }

  getDifficulty() {
    return this.difficulty;
  }

  getGrain() {
    return Math.round(this.grain);
  }

  setGrain(g) {
    this.grain = Math.round(g);
    if (this.grain < 0) {
      this.grain = 0;
      this.setMen(Math.floor(0.9 * this.getMen()));
    }
  }

  getMen() {
    return Math.round(this.men);
  }

  setMen(m) {
    this.men = Math.floor(m);
    if (this.men < 0) this.men = 0;
  }

  getCannons() {
    return Math.round(this.cannons);
  }

  setCannons(c) {
    this.cannons = Math.floor(c);
    if (this.cannons < 0) this.cannons = 0;
  }

  getReparation() {
    return Math.round(this.reparation);
  }

  setReparation(r) {
    this.reparation = Math.floor(r);
    if (this.reparation < 0) this.reparation = 0;
  }

  getJewels() {
    return Math.round(this.jewels);
  }

  setJewels(j) {
    this.jewels = Math.floor(j);
  }

  getMaxMovesBeforeNextPromotion() {
    return this.maxMovesBeforeNextPromotion;
  }

  getScoreToNextPromotion() {
    return this.scoreToNextPromotion;
  }

  getPosX() {
    return this.posX;
  }

  setPosX(x) {
    this.posX = x;
  }

  getPosY() {
    return this.posY;
  }

  setPosY(y) {
    this.posY = y;
  }

  getDeathReason() {
    return this.deathReason;
  }

  getRankType1() {
    const internalRankName = this.rankType1[Math.floor((this.difficulty - 2) / 2)];
    return formatString(`PlayerRank1_${internalRankName}`);
  }

  getRankType2() {
    const internalRankName = this.rankType2[Math.floor((this.difficulty - 2) / 2)];
    return formatString(`PlayerRank2_${internalRankName}`);
  }

  getPrizeMen() {
    return Math.round(this.prizeMen);
  }

  addToPrizeMen(m) {
    this.prizeMen = Math.round(this.prizeMen + Math.floor(m));
  }

  getPrizeMoney() {
    return Math.round(this.prizeMoney);
  }

  addToPrizeMoney(m) {
    this.prizeMoney += Math.floor(m);
  }
}
