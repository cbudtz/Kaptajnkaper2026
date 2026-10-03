import {
  AttackType,
  BoardState,
  CauseOfDeath,
  CgaMode,
} from '../constants/enums.js';
import { TextureKey } from '../constants/textureKeys.js';
import { playSound } from '../audio/playSound.js';

/**
 * Boarding combat (ported from legacy/board.js).
 */
export class BoardSystem {
  /**
   * @param {object} host
   * @param {import('./EnemyModel.js').EnemyModel} enemy
   * @param {import('./AttackSystem.js').AttackSystem} attack
   */
  constructor(host, enemy, attack) {
    this.host = host;
    this.currentPlayer = host.getCurrentPlayer();
    this.font = host.getCGAFont();

    this.currentEnemy = enemy;
    this.currentAttack = attack;

    this.shipY = 0;
    this.flagY = 0;

    this.playerMenLost = 0;
    this.enemyMenLost = 0;

    this.playerMenShow = 0;
    this.enemyMenShow = 0;

    this.playerMenLostShow = 0;
    this.enemyMenLostShow = 0;

    this.currentState = null;
    this.resetBoarding();
  }

  resetBoarding() {
    this.playerMenLost = 0;
    this.enemyMenLost = 0;
    this.playerMenLostShow = 0;
    this.enemyMenLostShow = 0;
    this.shipY = 220;
    this.flagY = 36;
    this.currentState = BoardState.SHIP_ANIMATION;
  }

  render(view) {
    view.setCgaMode(CgaMode.MODE1);

    view.drawImage(TextureKey.SHIP_BOARD_EN, 372, 30);
    view.drawImage(TextureKey.SHIP_BOARD_DA, 352, this.shipY);

    if (this.currentState === BoardState.FLAG_ANIMATION) {
      view.drawImage(TextureKey.FLAG_POLE, 96, 24);
      if (this.currentEnemy.getEnemyType() === 7) {
        view.drawImage(TextureKey.FLAG_PIRATE, 106, this.flagY);
      } else {
        view.drawImage(TextureKey.FLAG_EN, 106, this.flagY);
      }
    }

    if (this.currentState !== BoardState.SHIP_ANIMATION) {
      this.host.getMap().render(view);
      view.drawLabel('Boarding1', 0, 128);
      let enemyName = this.currentEnemy.getName();
      if (this.currentEnemy.getEnemyType() !== 7) {
        enemyName = this.font.getResourceAsString('BoardingEnemyName1')
          + enemyName.substring(enemyName.indexOf(' '));
      } else {
        enemyName = this.font.getResourceAsString('BoardingEnemyName2');
      }
      view.drawLabel('Boarding2', 0, 144, enemyName);
      view.drawLabel('Boarding3', 0, 160, this.enemyMenLostShow);
      view.drawLabel('Boarding4', 0, 176, this.enemyMenShow);
      view.drawLabel('Boarding5', 0, 192, this.playerMenLostShow);
      view.drawLabel('Boarding6', 0, 224);
      view.drawLabel('Boarding7', 0, 240);
      if (this.currentState === BoardState.FLAG_ANIMATION) {
        view.drawLabelRaw('          ', 25, 368);
        view.drawLabel('Map9', 25, 368, this.playerMenShow);
      }
    }
  }

  keyEvent(c) {
    if (this.currentState === BoardState.BOARDING) {
      const fight = this.font.getResourceAsString('BoardTypeF').charAt(0);
      const withdraw = this.font.getResourceAsString('BoardTypeW').charAt(0);

      if (c.toLowerCase() === fight) {
        this.boardEnemy();
      } else if (c.toLowerCase() === withdraw) {
        this.currentAttack.setCurrentAttack(AttackType.WITHDRAW);
      }
    }
  }

  showShipAnimation() {
    if (this.shipY > 50) {
      this.host.animationRepaint = true;
      this.shipY -= 20;
    } else {
      this.host.animationRepaint = false;
      this.currentState = BoardState.BOARDING;
      this.boardEnemy();
    }
  }

  showFlagAnimation() {
    if (this.flagY < 78) {
      this.host.animationRepaint = true;
      this.flagY += 1;
    } else {
      this.host.animationRepaint = false;
      this.currentEnemy.checkEnemyStatus();
      this.host.repaint();
    }
  }

  boardEnemy() {
    playSound('flute1');
    const playerMen = this.currentPlayer.getMen();
    const playerExp = this.currentPlayer.getExperience();
    const playerLost = this.currentPlayer.getBattlesLost();
    const playerDiff = this.currentPlayer.getDifficulty();
    const enemyMen = this.currentEnemy.getMen();
    const enemyMenTenth = Math.round(enemyMen / 10);

    let wlMen = enemyMen / playerMen;
    const wlExp = (playerExp + playerLost) / playerExp;
    const wlDiff = playerDiff / 10;
    let wlFactor = wlMen * wlExp * wlDiff;
    if (wlFactor > 1.2) wlFactor = 1.2;
    if (wlFactor < 0.6) wlFactor = 0.6;

    const d = Math.random();
    this.playerMenLost = Math.round(playerMen * wlExp * (playerDiff * d / 30));
    this.currentPlayer.setMen(playerMen - this.playerMenLost);

    this.currentPlayer.checkPlayerStatus();

    if (this.currentPlayer.getDeathReason() !== CauseOfDeath.NOT_YET) {
      return;
    }

    this.enemyMenLost = Math.round(this.playerMenLost / wlFactor);
    if (this.enemyMenLost < enemyMenTenth) this.enemyMenLost = enemyMenTenth;
    this.currentEnemy.setMen(enemyMen - this.enemyMenLost);

    if (this.currentEnemy.getMen() < 20) {
      if (this.enemyMenLostShow === 0) this.updateShowVariables();
      this.currentState = BoardState.FLAG_ANIMATION;
      this.showFlagAnimation();
    } else {
      this.updateShowVariables();
    }
  }

  updateShowVariables() {
    this.playerMenShow = this.currentPlayer.getMen();
    this.enemyMenShow = this.currentEnemy.getMen();
    this.playerMenLostShow = this.playerMenLost;
    this.enemyMenLostShow = this.enemyMenLost;
  }

  getCurrentState() {
    return this.currentState;
  }
}
