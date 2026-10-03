import {
  AttackOutcome,
  AttackType,
  CauseOfDeath,
  CgaFontMode,
  GameAction,
} from '../constants/enums.js';
import { playSound } from '../audio/playSound.js';
import { EnemyModel } from './EnemyModel.js';
import { ShootSystem } from './ShootSystem.js';
import { BoardSystem } from './BoardSystem.js';

/**
 * Enemy attack flow (ported from legacy/attack.js).
 */
export class AttackSystem {
  /** @param {object} host - Game host (legacy kaper) */
  constructor(host) {
    this.sunkMen = 0;

    this.host = host;
    this.currentPlayer = host.getCurrentPlayer();
    this.font = host.getCGAFont();

    this.currentEnemy = new EnemyModel(this.host, this);
    this.currentAttack = AttackType.NONE;

    this.currentShoot = new ShootSystem(this.host, this.currentEnemy, this);
    this.currentBoard = new BoardSystem(this.host, this.currentEnemy, this);

    this.sunkMen = 0;
  }

  render(view) {
    switch (this.currentAttack) {
      case AttackType.NONE:
        view.setFontMode(CgaFontMode.CGA_MODE2);
        this.host.getMap().render(view);
        view.drawLabel('Attack1', 0, 0);
        view.drawLabel('Attack2', 0, 16);
        view.drawLabel('Attack3', 0, 32, this.currentEnemy.getName());
        view.drawLabel(
          'Attack4',
          0,
          64,
          this.currentPlayer.getRankType1(),
          this.currentPlayer.getName(),
        );
        view.drawLabel('Attack5', 0, 80);
        view.drawLabel('Attack6', 0, 112);
        break;

      case AttackType.ATTACK:
        view.setFontMode(CgaFontMode.CGA_MODE2);
        this.host.getMap().render(view);
        view.drawLabel('Attacking1', 0, 0);
        view.drawLabel('Attacking2', 0, 16);
        break;

      case AttackType.SHOOT:
        this.currentShoot.render(view);
        break;

      case AttackType.BOARD:
        this.currentBoard.render(view);
        break;

      case AttackType.WITHDRAW:
        view.setFontMode(CgaFontMode.CGA_MODE2);
        this.host.getMap().render(view);
        view.drawLabel('Attack6', 0, 16);
        break;

      case AttackType.WON_SURRENDER:
        playSound('taps');
        // fall through
      case AttackType.WON_PRIZING:
        view.setFontMode(CgaFontMode.CGA_MODE1);
        view.drawLabel('AttackSurrender1', 0, 0);
        view.drawLabel('AttackSurrender2', 0, 16, this.currentEnemy.getMoney());
        if (this.currentEnemy.getMen() > 1) {
          view.drawLabel('AttackSurrender3', 0, 32, this.currentEnemy.getMen());
        } else {
          view.drawLabel('AttackSurrender4', 0, 32);
        }
        view.drawLabel('AttackSurrender5', 0, 48, this.currentEnemy.getGrain());
        view.drawLabel('AttackSurrender6', 0, 64);
        view.drawLabel('AttackSurrender7', 0, 96);
        view.drawLabel('AttackSurrender8', 0, 112, this.currentEnemy.getPrizeCost());
        view.drawLabel('AttackSurrender9', 0, 128, this.currentPlayer.getMen());
        view.drawLabel('AttackSurrender10', 0, 144);
        view.drawLabel('AttackSurrender11', 0, 160);
        if (this.currentAttack === AttackType.WON_PRIZING) {
          view.drawLabel('AttackSurrender12', 0, 192);
          view.drawLabel('Continue', 0, 224);
        }
        break;

      case AttackType.WON_SUNK:
        playSound('taps');
        view.setFontMode(CgaFontMode.CGA_MODE1);
        view.drawLabel('AttackSunk1', 0, 0);
        let moreLines = 0;
        if (this.sunkMen > 0) {
          view.drawLabel('AttackSunk2', 0, 16, this.sunkMen);
          this.moreLines += 16;
        }
        view.drawLabel('Continue', 0, 32 + moreLines);
        break;

      default:
        break;
    }
  }

  keyEvent(c) {
    switch (this.currentAttack) {
      case AttackType.NONE:
      case AttackType.WITHDRAW: {
        const a = this.font.getResourceAsString('AttackY').charAt(0);
        const flee = this.font.getResourceAsString('AttackN').charAt(0);

        if (this.currentAttack === AttackType.NONE) {
          this.currentPlayer.addToExperience();
        }

        if (c.toLowerCase() === a) {
          this.currentAttack = AttackType.ATTACK;
        } else if (c.toLowerCase() === flee) {
          playSound('flee');
          this.resetAttack(AttackOutcome.LOST);
        } else {
          playSound('beep');
        }
        break;
      }

      case AttackType.ATTACK: {
        const board = this.font.getResourceAsString('AttackTypeB').charAt(0);
        const shoot = this.font.getResourceAsString('AttackTypeS').charAt(0);

        if (c.toLowerCase() === board) {
          this.currentAttack = AttackType.BOARD;
          this.currentBoard.resetBoarding();
          this.currentBoard.showShipAnimation();
        } else if (c.toLowerCase() === shoot) {
          this.currentAttack = AttackType.SHOOT;
          this.currentShoot.prepareShooting();
        } else {
          playSound('beep');
        }
        break;
      }

      case AttackType.SHOOT:
      case AttackType.BOARD:
        if (this.currentAttack === AttackType.BOARD) {
          this.currentBoard.keyEvent(c);
        } else {
          this.currentShoot.keyEvent(c);
        }

        if (this.currentPlayer.getDeathReason() !== CauseOfDeath.NOT_YET) {
          this.resetAttack(AttackOutcome.LOST);
        } else if (this.currentEnemy.getMen() < 20) {
          this.currentPlayer.addToScore(this.currentEnemy.getMoney() / 10);
        }
        break;

      case AttackType.WON_SURRENDER: {
        const prize = this.font.getResourceAsString('AttackSurrenderP').charAt(0);
        const sink = this.font.getResourceAsString('AttackSurrenderS').charAt(0);

        this.host.getMap().setCurrentMapDataValue(50);

        this.currentPlayer.setMoney(this.currentPlayer.getMoney() + this.currentEnemy.getMoney());
        let grain = this.currentEnemy.getGrain();
        if (grain === 1) grain = 2;
        this.currentPlayer.setGrain(this.currentPlayer.getGrain() + grain);

        if (c.toLowerCase() === prize) {
          this.currentAttack = AttackType.WON_PRIZING;
          if (this.currentPlayer.getDifficulty() < Math.floor(Math.random() * 16)) {
            this.currentPlayer.addToPrizeMen(this.currentEnemy.getPrizeCost());
            this.currentPlayer.addToPrizeMoney(this.currentEnemy.getMoney());
          }
        } else if (c.toLowerCase() === sink) {
          this.currentAttack = AttackType.WON_SUNK;
          const newMen = this.currentPlayer.getMen() + this.currentEnemy.getMen();
          if (newMen > 500) {
            this.currentPlayer.setMen(500);
            this.sunkMen = newMen - 500;
          } else {
            this.currentPlayer.setMen(newMen);
          }
        } else {
          playSound('beep');
        }
        break;
      }

      case AttackType.WON_PRIZING:
        this.currentPlayer.setMen(this.currentPlayer.getMen() - this.currentEnemy.getPrizeCost());
        this.resetAttack(AttackOutcome.WON);
        this.currentPlayer.checkPlayerStatus();
        break;

      case AttackType.WON_SUNK:
        this.host.getMap().setCurrentMapDataValue(50);
        this.resetAttack(AttackType.WON_SUNK);
        break;

      default:
        break;
    }
  }

  resetAttack(t) {
    if (t === AttackOutcome.LOST) {
      this.currentPlayer.addToBattlesLost();
    } else {
      this.currentPlayer.addToBattlesWon();
    }

    this.currentAttack = AttackType.NONE;
    this.currentEnemy.prepareNextEnemy();
    this.host.setCurrentAction(GameAction.MAP);
    this.sunkMen = 0;
  }

  getCurrentAttack() {
    return this.currentAttack;
  }

  setCurrentAttack(a) {
    this.currentAttack = a;
  }

  getCurrentBoard() {
    return this.currentBoard;
  }
}
