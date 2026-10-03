import { GameAction, GameStep, CgaMode } from '../constants/enums.js';
import { getLabelText } from '../text/getLabelText.js';

export class HarborSystem {
  static actionType = { INTRO: 0, SAILING: 1, HARBOR_PRIZES: 2, HARBOR_DEAD: 3 };

  static windType = { LEFT: 0, RIGHT: 1 };

  /**
   * @param {import('../host/GameHost.js').GameHost} host
   */
  constructor(host) {
    this.host = host;
    this.currentPlayer = host.getCurrentPlayer();

    this.collectPrizes = null;
    this.currentCity = null;
    this.currentAction = null;
    this.currentWind = null;
    this.harborShips = null;
    this.playerShip = null;
    this.harborHoleSize = 0;
    this.harborHoleLocation = null;
    this.playerMove = null;
    this.showWindArrows = null;
  }

  /**
   * @param {import('../view/GameView.js').GameView} view
   */
  render(view) {
    view.setCgaMode(CgaMode.MODE2);

    switch (this.currentAction) {
      case HarborSystem.actionType.INTRO:
        view.drawLabel('Harbor1', 0, 0, this.currentCity);
        view.drawLabel('Harbor2', 0, 16);
        view.drawLabel('Harbor3', 0, 32);
        view.drawLabel('Harbor4', 0, 48);
        view.drawLabel('Harbor5', 0, 64);
        view.drawLabel('Harbor6', 0, 96);
        view.drawLabel('Harbor7', 0, 112);
        view.drawLabel('Harbor8', 0, 128);
        view.drawLabel('Harbor9', 0, 144);
        view.drawLabel('Harbor10', 0, 160);
        view.drawLabel('Harbor11', 0, 192);
        if (this.currentWind === HarborSystem.windType.LEFT) {
          view.drawLabel('Harbor12', 208, 208);
          view.drawLabelRaw(String.fromCharCode(129), 256, 224);
        } else {
          view.drawLabel('Harbor13', 208, 208);
          view.drawLabelRaw(String.fromCharCode(128), 256, 224);
        }
        view.drawLabel('Continue', 0, 256);
        break;

      case HarborSystem.actionType.SAILING:
        for (let i = 0; i < this.harborShips.length; i += 1) {
          const x = this.harborShips[i].x * 20;
          const y = this.harborShips[i].y * 16 - this.playerShip.y * 16;
          view.drawImage('ship-harbor', x, y);
        }
        {
          const bottomY = 332 - this.playerShip.y * 16;
          view.drawImage('harbor-border-bottom', 14, bottomY);
          view.drawImage('harbor-border-bottom', 612, bottomY);
          for (let i = 1; i <= this.harborHoleLocation; i += 1) {
            view.drawImage('harbor-border-bottom', 20 * i, bottomY);
          }
          for (let i = this.harborHoleLocation + this.harborHoleSize; i <= 31; i += 1) {
            view.drawImage('harbor-border-bottom', 20 * i, bottomY);
          }
          const borderY = 12 - this.playerShip.y * 16;
          view.drawImage('harbor-border', 0, borderY);
          view.drawImage('harbor-border', 624, borderY);
          const shipX = this.playerShip.x * 20;
          view.drawImage('ship-map-mode2', shipX, 32);
          const arrowsX = Math.round(shipX);
          if (this.showWindArrows && this.currentWind === HarborSystem.windType.LEFT) {
            const arrow = String.fromCharCode(129);
            view.drawLabelRaw(arrow + arrow + arrow, arrowsX, 16);
          } else if (this.showWindArrows && this.currentWind === HarborSystem.windType.RIGHT) {
            const arrow = String.fromCharCode(128);
            view.drawLabelRaw(arrow + arrow + arrow, arrowsX, 16);
          }
        }
        break;

      case HarborSystem.actionType.HARBOR_PRIZES:
        view.drawLabel('Prize1', 0, 0);
        view.drawLabel('Prize2', 0, 16, this.currentPlayer.getPrizeMen());
        view.drawLabel('Prize3', 0, 32);
        view.drawLabel('Prize4', 0, 48, this.currentPlayer.getPrizeMoney());
        view.drawLabel('Prize5', 0, 64);
        view.drawLabel('Continue', 0, 96);
        break;

      case HarborSystem.actionType.HARBOR_DEAD:
        view.drawLabel('Dead1', 0, 0);
        if (getLabelText('Dead2').length > 0) {
          view.drawLabel('Dead2', 0, 16);
          view.drawLabel('Continue', 0, 32);
        } else {
          view.drawLabel('Continue', 0, 16);
        }
        break;

      default:
        break;
    }
  }

  keyEvent(c) {
    switch (this.currentAction) {
      case HarborSystem.actionType.INTRO:
        this.currentAction = HarborSystem.actionType.SAILING;
        break;

      case HarborSystem.actionType.SAILING:
        if (this.playerShip.y === 0) {
          this.host.animationRepaint = true;
        }

        if (this.playerMove === 0) {
          if (c === '4' || c === 'ArrowLeft') {
            this.playerMove = 1;
          } else if (c === '6' || c === 'ArrowRight') {
            this.playerMove = 2;
          }
        }
        break;

      case HarborSystem.actionType.HARBOR_PRIZES:
        this.currentPlayer.collectPrizes();
        this.host.setCurrentAction(GameAction.CITY);
        break;

      case HarborSystem.actionType.HARBOR_DEAD:
        this.host.setCurrentStep(GameStep.HIGHSCORE);
        break;

      default:
        break;
    }
  }

  setNewHarbor(cityName, collect) {
    this.collectPrizes = collect;
    this.currentCity = cityName;
    this.currentAction = HarborSystem.actionType.INTRO;
    this.playerShip = { x: 12, y: 0 };
    this.playerMove = 0;
    this.showWindArrows = false;

    this.currentWind = (Math.floor(Math.random() * 2) < 1)
      ? HarborSystem.windType.LEFT
      : HarborSystem.windType.RIGHT;

    const noOfShips = this.currentPlayer.getDifficulty() * 5 + 1;
    this.harborShips = [];
    for (let i = 0; i < noOfShips; i += 1) {
      this.harborShips[i] = {
        x: Math.round(Math.random() * 29) + 1,
        y: Math.round(Math.random() * 14) + 1,
      };
    }

    const diff = this.currentPlayer.getDifficulty();
    this.harborHoleSize = 9 - Math.round(diff / 2);
    this.harborHoleLocation = 12 - diff + Math.round(1 + Math.random() * (6 + 2 * diff));
  }

  showSailingAnimation() {
    this.playerShip.y += 1;

    if (Math.random() <= this.currentPlayer.getDifficulty() / 18) {
      this.showWindArrows = true;

      if (this.currentWind === HarborSystem.windType.LEFT) {
        this.playerShip.x += 1;
      } else {
        this.playerShip.x -= 1;
      }
    } else {
      this.showWindArrows = false;
    }

    if (!this.showWindArrows && this.playerMove === 1 && this.playerShip.x >= 0) {
      this.playerShip.x -= 1;
    } else if (!this.showWindArrows && this.playerMove === 2 && this.playerShip.x <= 25) {
      this.playerShip.x += 1;
    }
    this.playerMove = 0;

    for (let i = 0; i < this.harborShips.length; i += 1) {
      const harborShipX = this.harborShips[i].x;
      const harborShipY = this.harborShips[i].y;
      const playerShipX = this.playerShip.x;
      const playerShipY = this.playerShip.y;

      if (playerShipX === harborShipX && playerShipY === harborShipY) {
        this.currentPlayer.setReparation(
          this.currentPlayer.getReparation() - 15 * this.currentPlayer.getDifficulty(),
        );
        if (this.currentPlayer.getReparation() <= 20) {
          this.currentAction = HarborSystem.actionType.HARBOR_DEAD;
          return;
        }
      }
    }

    if (this.playerShip.y === 18) {
      this.host.animationRepaint = false;

      const harborRightBorderStart = (this.harborHoleLocation + this.harborHoleSize);
      if (this.playerShip.x <= this.harborHoleLocation || this.playerShip.x >= harborRightBorderStart) {
        this.currentPlayer.setReparation(0);
        this.currentAction = HarborSystem.actionType.HARBOR_DEAD;
        return;
      }

      if (this.collectPrizes && this.currentPlayer.getPrizeMen() > 0) {
        this.currentAction = HarborSystem.actionType.HARBOR_PRIZES;
      } else {
        this.host.setCurrentAction(GameAction.CITY);
      }
    }
  }

  getCurrentAction() {
    return this.currentAction;
  }
}
