import { GameAction, GameStep, CauseOfDeath, CgaMode } from '../constants/enums.js';
import { getLabelText } from '../text/getLabelText.js';

export class MapSystem {
  /**
   * @param {import('../host/KaperGameHost.js').KaperGameHost} host
   */
  constructor(host) {
    this.host = host;
    this.currentPlayer = host.getCurrentPlayer();
    this.currentMapData = [];
    this.resetMap();
  }

  resetMap() {
    this.currentMapData = [
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 5, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 6, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0],
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0],
      [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 8, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    ];
  }

  /**
   * @param {import('../view/PhaserGameView.js').PhaserGameView} view
   */
  render(view) {
    if (this.host.getCurrentAction() === GameAction.MAP) {
      view.setCgaMode(CgaMode.MODE2);
      view.drawImage('map-mode2', 9, 0);
      view.drawLabel('Map3', 41, 304);
      view.drawLabel('Map4', 265, 304);
      view.drawLabel('Map5', 473, 304);
      view.drawLabel('Map1', 41, 0, this.currentPlayer.getScore());
      view.drawLabel(
        'Map2',
        249,
        0,
        this.currentPlayer.getScoreToNextPromotion(),
        this.currentPlayer.getMaxMovesBeforeNextPromotion(),
      );
      const pixelX = this.currentPlayer.getPosX() * 20 + 11;
      const pixelY = this.currentPlayer.getPosY() * 20 + 2;
      view.drawImage('ship-map-mode2', pixelX, pixelY);
    } else if (view.cgaMode === CgaMode.MODE1) {
      view.drawImageCrop('map-mode1', 9, 325, 622, 69, 0, 325, 622, 69);
    } else {
      view.drawImageCrop('map-mode2', 9, 325, 622, 69, 0, 325, 622, 69);
    }

    view.drawLabel('Map6', 25, 336, this.currentPlayer.getMoves());
    view.drawLabel('Map7', 217, 336, this.currentPlayer.getMoney());
    view.drawLabel('Map8', 441, 336, this.currentPlayer.getGrain());
    view.drawLabel('Map9', 25, 368, this.currentPlayer.getMen());
    view.drawLabel('Map10', 217, 368, this.currentPlayer.getCannons());
    view.drawLabel('Map11', 441, 368, this.currentPlayer.getReparation());
  }

  keyEvent(c) {
    if (c === 'F1') {
      this.host.setCurrentAction(GameAction.HELP);
    } else if (c === 'Escape') {
      this.host.setCurrentStep(GameStep.HIGHSCORE);
    } else {
      this.moveShip(c);
    }
  }

  moveShip(direction) {
    let posX = this.currentPlayer.getPosX();
    let posY = this.currentPlayer.getPosY();
    let triedtomove = false;

    switch (direction) {
      case '9':
        posX += 1;
        posY -= 1;
        triedtomove = true;
        break;
      case '3':
        posX += 1;
        posY += 1;
        triedtomove = true;
        break;
      case '1':
        posX -= 1;
        posY += 1;
        triedtomove = true;
        break;
      case '7':
        posX -= 1;
        posY -= 1;
        triedtomove = true;
        break;
      case '4':
      case 'ArrowLeft':
        posX -= 1;
        triedtomove = true;
        break;
      case '8':
      case 'ArrowUp':
        posY -= 1;
        triedtomove = true;
        break;
      case '6':
      case 'ArrowRight':
        posX += 1;
        triedtomove = true;
        break;
      case '2':
      case 'ArrowDown':
        posY += 1;
        triedtomove = true;
        break;
      default:
        break;
    }

    if (!triedtomove) return;

    if (posX >= 1 && posX <= 29 && posY >= 1 && posY <= 14) {
      const mapValue = this.currentMapData[posY - 1][posX - 1];
      if (mapValue !== 0) {
        this.currentPlayer.setPosX(posX);
        this.currentPlayer.setPosY(posY);
        if (mapValue > 1 && mapValue < 9) {
          this.host.setCurrentAction(GameAction.HARBOR);
          const cityName = getLabelText(`CityName${mapValue - 1}`);
          if (mapValue === 8) {
            this.host.getHarbor().setNewHarbor(cityName, true);
          } else {
            this.host.getHarbor().setNewHarbor(cityName, false);
          }
          this.host.getCity().setNewCity(cityName);
        }
      } else {
        this.currentPlayer.setReparation(this.currentPlayer.getReparation() - 3);
      }
    }

    this.currentPlayer.addMove();
    this.currentPlayer.checkPlayerStatus();

    if (
      this.host.getCurrentAction() === GameAction.MAP
      && this.currentPlayer.getDeathReason() === CauseOfDeath.NOT_YET
    ) {
      this.checkForSeaEvent();
    }
  }

  checkForSeaEvent() {
    const d = Math.random();
    if (0.25 > d) {
      const event = 1 + Math.floor(Math.random() * 10);
      if (event > 8) {
        this.host.setCurrentAction(GameAction.MIST);
      } else {
        const mapValue = this.currentMapData[this.currentPlayer.getPosY() - 1][this.currentPlayer.getPosX() - 1];
        if (mapValue === 1) this.host.setCurrentAction(GameAction.ATTACK);
      }
    }
  }

  getCurrentMapDataValue() {
    return this.currentMapData[this.currentPlayer.getPosY() - 1][this.currentPlayer.getPosX() - 1];
  }

  setCurrentMapDataValue(value) {
    this.currentMapData[this.currentPlayer.getPosY() - 1][this.currentPlayer.getPosX() - 1] = value;
  }
}
