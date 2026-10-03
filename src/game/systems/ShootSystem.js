import {
  AttackType,
  CauseOfDeath,
  CgaMode,
  EnemyState,
  ShootState,
} from '../constants/enums.js';
import { TextureKey } from '../constants/textureKeys.js';

/**
 * Cannon shooting combat (ported from legacy/shoot.js).
 */
export class ShootSystem {
  /**
   * @param {object} host
   * @param {import('./EnemyModel.js').EnemyModel} enemy
   * @param {import('./AttackSystem.js').AttackSystem} attack
   */
  constructor(host, enemy, attack) {
    this.host = host;
    this.currentPlayer = host.getCurrentPlayer();
    this.font = host.getCGAFont();

    this.enemyDistance = undefined;
    this.windDirection = undefined;
    this.windStrength = undefined;
    this.shotSide = 0;
    this.shotElevation = 0;
    this.enemyShots = undefined;
    this.playerShotSmall = undefined;
    this.playerShotLarge = undefined;
    this.showEnemyShots = undefined;
    this.showPlayerLargeShot = undefined;

    this.currentAttack = attack;
    this.currentEnemy = enemy;
    this.currentState = ShootState.SHOOTING;
  }

  render(view) {
    view.setCgaMode(CgaMode.MODE1);
    view.drawImage(TextureKey.SHOOT, 9, 0);
    const x = (this.windDirection / 3) * 20;
    const y = (this.windDirection % 3) * 20;
    view.drawImage(TextureKey.SHOOT_WIND, 37 + x, 338 + y);
    view.drawLabel('Shooting1', 41, 32);
    view.drawLabel('Shooting2', 41, 144);
    view.drawLabel('Shooting3', 441, 176);
    view.drawLabel('Shooting4', 41, 224);
    if (this.currentState === ShootState.SHOOTING) {
      view.drawLabel('Shooting5', 265, 240);
    } else {
      view.drawLabel('Shooting11', 265, 240);
    }
    view.drawLabel('Shooting6', 25, 272, this.enemyDistance);
    view.drawLabel('Shooting2', 281, 272);
    view.drawLabel('Shooting1', 473, 272);
    view.drawLabel('Shooting7', 25, 304);
    view.drawLabelRaw(String(this.windStrength), 57, 320);
    view.drawLabel('Shooting8', 121, 304);
    view.drawLabel('Shooting9', 121, 336);
    view.drawLabel('Shooting10', 121, 368);
    view.drawLabelRaw(String(this.currentPlayer.getCannons()), 265, 304);
    view.drawLabelRaw(String(this.currentPlayer.getMen()), 265, 336);
    view.drawLabelRaw(String(this.currentPlayer.getReparation()), 265, 368);
    view.drawLabelRaw(String(this.currentEnemy.getCannons()), 457, 304);
    view.drawLabelRaw(String(this.currentEnemy.getMen()), 457, 336);
    view.drawLabelRaw(String(this.currentEnemy.getReparation()), 457, 368);
    view.drawImage(TextureKey.SHOOT_CROSS, 449 + this.shotSide, 80 + this.shotElevation);

    if (this.currentPlayer.getDifficulty() > 4) {
      view.fillRect(31, 22, 278, 98);
      view.drawImage(TextureKey.FLAG_POLE, 105, 24);
      if (this.currentEnemy.getEnemyType() === 8) {
        view.drawImage(TextureKey.FLAG_EN, 115, 36);
      } else {
        view.drawImage(TextureKey.FLAG_PIRATE, 115, 36);
      }
    }

    if (this.currentState === ShootState.SHOT) {
      if (this.showEnemyShots) {
        for (let i = 0; i < this.enemyShots.length; i++) {
          view.drawImage(
            TextureKey.SHOOT_HIT,
            40 + this.enemyShots[i][0],
            140 + this.enemyShots[i][1],
          );
        }
      }
      if (this.currentPlayer.getDifficulty() <= 4) {
        view.drawImage(
          TextureKey.SHOOT_HIT,
          this.playerShotSmall[0],
          this.playerShotSmall[1],
        );
      }
      if (this.showPlayerLargeShot) {
        view.drawImage(
          TextureKey.SHOOT_MISS1,
          this.playerShotLarge[0],
          this.playerShotLarge[1],
        );
      }
    }
  }

  keyEvent(c) {
    switch (this.currentState) {
      case ShootState.SHOOTING: {
        const fire = this.font.getResourceAsString('ShootTypeF').charAt(0);
        const withdraw = this.font.getResourceAsString('ShootTypeW').charAt(0);

        if (c.toLowerCase() === fire) {
          this.fireShots();

          if (
            this.currentPlayer.getDeathReason() === CauseOfDeath.NOT_YET
            && this.currentEnemy.getCurrentState() === EnemyState.GOOD
          ) {
            this.currentState = ShootState.SHOT;
          } else {
            this.resetShooting();
          }
        } else if (c.toLowerCase() === withdraw) {
          this.resetShooting();
          this.currentAttack.setCurrentAttack(AttackType.WITHDRAW);
        }
        this.moveShotCross(c);
        break;
      }
      case ShootState.SHOT:
        this.currentState = ShootState.SHOOTING;
        break;
      default:
        break;
    }
  }

  prepareShooting() {
    this.resetShooting();
    this.windDirection = Math.floor(Math.random() * 9);
    this.windStrength = 1 + Math.floor(Math.random() * 10);
    if (this.windDirection === 4) this.windStrength = 0;
  }

  resetShooting() {
    this.enemyDistance = 500 + Math.floor(Math.random() * 500);
    this.shotSide = 0;
    this.shotElevation = 0;
    this.currentState = ShootState.SHOOTING;
  }

  moveShotCross(direction) {
    switch (direction) {
      case '9':
        this.shotSide += 2;
        this.shotElevation -= 2;
        break;
      case '3':
        this.shotSide += 2;
        this.shotElevation += 2;
        break;
      case '1':
        this.shotSide -= 2;
        this.shotElevation += 2;
        break;
      case '7':
        this.shotSide -= 2;
        this.shotElevation -= 2;
        break;
      case '4':
      case 'ArrowLeft':
        this.shotSide -= 2;
        break;
      case '8':
      case 'ArrowUp':
        this.shotElevation -= 2;
        break;
      case '6':
      case 'ArrowRight':
        this.shotSide += 2;
        break;
      case '2':
      case 'ArrowDown':
        this.shotElevation += 2;
        break;
      default:
        break;
    }

    if (this.shotSide < -100) this.shotSide = -100;
    if (this.shotSide > 100) this.shotSide = 100;
    if (this.shotElevation < -60) this.shotElevation = -60;
    if (this.shotElevation > 60) this.shotElevation = 60;
  }

  fireShots() {
    let pMen = this.currentPlayer.getMen();
    let pRep = this.currentPlayer.getReparation();
    let pCan = this.currentPlayer.getCannons();
    const pDif = this.currentPlayer.getDifficulty();
    const pExp = this.currentPlayer.getExperience();
    const pLos = this.currentPlayer.getBattlesLost();

    let eMen = this.currentEnemy.getMen();
    let eRep = this.currentEnemy.getReparation();
    let eCan = this.currentEnemy.getCannons();

    const lostFactor = (pExp + pLos) / pExp;

    if (Math.random() > 0.4) {
      let cannonFactor = eCan / 1.4;
      this.currentPlayer.setMen(
        pMen - Math.round(cannonFactor * lostFactor) - Math.round(pDif * Math.random() * 0.5),
      );
    }
    if (Math.random() > 0.4) {
      let cannonFactor = eCan / 1.3;
      this.currentPlayer.setReparation(
        pRep - Math.round(cannonFactor * lostFactor) - Math.round(pDif * Math.random() * 0.5),
      );
    }
    let cannonFactor = eCan / 5;
    if (Math.random() * 100 < pDif + cannonFactor) {
      this.currentPlayer.setCannons(pCan - 1);
      if (this.currentPlayer.getCannons() < 1) this.currentPlayer.setCannons(1);
    }

    this.currentPlayer.checkPlayerStatus();

    if (this.currentPlayer.getDeathReason() !== CauseOfDeath.NOT_YET) {
      return;
    }

    let shotDifficulty = 2;
    if (this.currentPlayer.getDifficulty() > 4) shotDifficulty = 1;
    if (this.currentPlayer.getDifficulty() > 6) shotDifficulty = 0;

    const sideValue = 10 * ((this.windDirection / 3) - 1);
    const elevationValue = 10 * ((this.windDirection % 3) - 1);
    let shotHorizontal = Math.round(this.windStrength * sideValue * 0.1)
      + Math.round((sideValue * 0.2 * Math.random()) - Math.round(this.shotSide * 0.2));
    let shotVertical = this.enemyDistance - (700 + (this.windStrength * elevationValue)
      - (10 * this.shotElevation) + Math.floor(Math.random() * 50) - Math.floor(Math.random() * 50));

    if (shotHorizontal > 20) shotHorizontal = 20;
    if (shotHorizontal < -20) shotHorizontal = -20;

    if (
      shotHorizontal <= shotDifficulty && shotHorizontal >= -shotDifficulty
      && shotVertical <= 0 && shotVertical >= -50
    ) {
      pMen = this.currentPlayer.getMen();
      pRep = this.currentPlayer.getReparation();
      pCan = this.currentPlayer.getCannons();

      const tempRep = eRep - Math.round((2 * pCan) / pDif) + shotVertical;
      if (tempRep < eRep) this.currentEnemy.setReparation(tempRep);
      const tempCan = eCan - Math.round((Math.random() * 10) / pDif);
      this.currentEnemy.setCannons(tempCan);

      this.currentEnemy.checkEnemyStatus();

      if (this.currentEnemy.getCurrentState() === EnemyState.GOOD) {
        const tempMen = eMen - Math.round(
          0.9 * eMen * (pCan + (shotVertical / 5) + (Math.random() * 10)) / 100,
        );
        if (tempMen < eMen) this.currentEnemy.setMen(tempMen);
      }

      this.currentEnemy.checkEnemyStatus();

      if (this.currentEnemy.getCurrentState() !== EnemyState.GOOD) {
        return;
      }
    }

    const cMen = this.currentPlayer.getMen();
    const cRep = this.currentPlayer.getReparation();
    const cCan = this.currentPlayer.getCannons();
    if (pMen !== cMen || pRep !== cRep || pCan !== cCan) {
      this.showEnemyShots = true;

      let noEnemyShots = (pMen - cMen) + (pRep - cRep) + (pCan - cCan);
      if (noEnemyShots > 10) noEnemyShots = 10;
      if (noEnemyShots > eCan) noEnemyShots = eCan;

      this.enemyShots = [];
      for (let i = 0; i < noEnemyShots; i++) {
        this.enemyShots[i] = [];
        this.enemyShots[i][0] = Math.floor(Math.random() * 220);
        this.enemyShots[i][1] = Math.floor(Math.random() * 40);
      }
    } else {
      this.showEnemyShots = false;
    }

    this.playerShotSmall = [];
    this.playerShotLarge = [];

    this.playerShotSmall[1] = 70;
    if (shotVertical > 0) this.playerShotSmall[1] = 98;
    if (shotVertical < -49) this.playerShotSmall[1] = 40;

    if (shotHorizontal <= shotDifficulty && shotHorizontal >= -shotDifficulty) {
      this.playerShotSmall[0] = 169;
      this.playerShotLarge[0] = 459;
      if (shotVertical <= 0 && shotVertical >= -50) {
        this.playerShotLarge[1] = 120;
      } else {
        this.playerShotLarge[1] = 140;
      }
    } else {
      this.playerShotLarge[1] = 120;
      if (shotHorizontal > shotDifficulty) {
        this.playerShotLarge[0] = 399 - 4 * shotHorizontal;
        this.playerShotSmall[0] = 75;
      } else {
        this.playerShotLarge[0] = 499 - 4 * shotHorizontal;
        this.playerShotSmall[0] = 269;
      }
    }

    if (shotVertical < -50) {
      this.showPlayerLargeShot = false;
    } else {
      this.showPlayerLargeShot = true;
    }
  }
}
