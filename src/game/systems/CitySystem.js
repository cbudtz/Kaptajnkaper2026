import { GameAction, CgaMode } from '../constants/enums.js';
import { playSound } from '../audio/playSound.js';
import { getLabelText } from '../text/getLabelText.js';

export class CitySystem {
  static actionType = { NONE: 0, BUY: 1, SELL_1: 2, SELL_2: 3 };

  /**
   * @param {import('../host/GameHost.js').GameHost} host
   */
  constructor(host) {
    this.host = host;
    this.currentPlayer = host.getCurrentPlayer();

    this.currentCity = '';
    this.pResources = [0, 0, 0, 0, 0];
    this.pStandard = [10, 8, 100, 5, 50];
    this.currentActionChar = undefined;
    this.currentBuySellAmount = undefined;
    this.currentBuySellError = undefined;
    this.currentAction = undefined;
  }

  /**
   * @param {import('../view/GameView.js').GameView} view
   */
  render(view) {
    view.setCgaMode(CgaMode.MODE2);

    view.drawLabel('Map1', 41, 0, this.currentPlayer.getScore());
    view.drawLabel(
      'Map2',
      249,
      0,
      this.currentPlayer.getScoreToNextPromotion(),
      this.currentPlayer.getMaxMovesBeforeNextPromotion(),
    );

    view.drawLabel('Map3', 41, 304);
    view.drawLabel('Map4', 265, 304);
    view.drawLabel('Map5', 473, 304);

    view.drawLabel('Map6', 25, 336, this.currentPlayer.getMoves());
    view.drawLabel('Map7', 217, 336, this.currentPlayer.getMoney());
    view.drawLabel('Map8', 441, 336, this.currentPlayer.getGrain());
    view.drawLabel('Map9', 25, 368, this.currentPlayer.getMen());
    view.drawLabel('Map10', 217, 368, this.currentPlayer.getCannons());
    view.drawLabel('Map11', 441, 368, this.currentPlayer.getReparation());

    view.drawLabel('City1', 0, 32, this.currentCity);
    if (this.currentAction === CitySystem.actionType.NONE) {
      view.drawLabel('City2', 0, 64, '');
    } else if (this.currentAction === CitySystem.actionType.BUY) {
      view.drawLabel('City2', 0, 64, this.currentActionChar);
    } else {
      view.drawLabel('City2', 0, 64, '5');
    }
    view.drawLabel('City3', 0, 96, this.pResources[0]);
    view.drawLabel('City4', 0, 112, this.pResources[1]);
    view.drawLabel('City5', 0, 128, this.pResources[2]);
    view.drawLabel('City6', 0, 144, this.pResources[3]);
    view.drawLabel('City7', 0, 160);
    view.drawLabel('City8', 0, 176);

    if (this.currentAction === CitySystem.actionType.BUY) {
      view.drawLabel('CityBuy1', 0, 208, this.currentBuySellAmount);
    }

    if (this.currentAction === CitySystem.actionType.SELL_1
      || this.currentAction === CitySystem.actionType.SELL_2) {
      view.drawLabel('CitySell1', 0, 208);
    }
    if (this.currentAction === CitySystem.actionType.SELL_2) {
      view.drawLabel(`CitySell${this.currentActionChar - 1}`, 0, 224, this.currentBuySellAmount);
    }

    if (this.currentBuySellError.length > 0) {
      view.drawLabelRaw(this.currentBuySellError, 0, 240);
    }
  }

  keyEvent(c) {
    if (c === 'F1') {
      this.host.setCurrentAction(GameAction.HELP);
    }
    if (this.currentAction === CitySystem.actionType.NONE) {
      switch (c) {
        case '1':
          this.currentActionChar = 1;
          this.currentAction = CitySystem.actionType.BUY;
          break;
        case '2':
          this.currentActionChar = 2;
          this.currentAction = CitySystem.actionType.BUY;
          break;
        case '3':
          this.currentActionChar = 3;
          this.currentAction = CitySystem.actionType.BUY;
          break;
        case '4':
          this.currentActionChar = 4;
          this.currentAction = CitySystem.actionType.BUY;
          break;
        case '5':
          this.currentActionChar = 5;
          this.currentAction = CitySystem.actionType.SELL_1;
          break;
        case '6':
          this.host.setCurrentAction(GameAction.MAP);
          this.currentPlayer.checkPlayerStatus();
          break;
        default:
          playSound('beep');
          break;
      }
    } else if ((this.currentAction === CitySystem.actionType.BUY
      || this.currentAction === CitySystem.actionType.SELL_2)
      && this.currentBuySellError.length === 0) {
      if (c >= 0 && c <= 9 && this.currentBuySellAmount.length < 4) {
        this.currentBuySellAmount += c;
      } else if (c === 'Backspace') {
        if (this.currentBuySellAmount.length > 0) {
          this.currentBuySellAmount = this.currentBuySellAmount.substring(
            0,
            this.currentBuySellAmount.length - 1,
          );
        }
      } else if (c === 'Enter' && this.currentBuySellAmount.length > 0) {
        if (this.currentAction === CitySystem.actionType.BUY) {
          this.buyResources();
        } else {
          this.sellResources();
        }
      }
    } else if (this.currentAction === CitySystem.actionType.SELL_1) {
      const cannons = getLabelText('CitySellC').charAt(0);
      const grain = getLabelText('CitySellG').charAt(0);
      const jewels = getLabelText('CitySellJ').charAt(0);

      if (c === cannons) {
        this.currentActionChar = 3;
        this.currentAction = CitySystem.actionType.SELL_2;
      } else if (c === grain) {
        this.currentActionChar = 4;
        this.currentAction = CitySystem.actionType.SELL_2;
      } else if (c === jewels) {
        this.currentActionChar = 5;
        this.currentAction = CitySystem.actionType.SELL_2;
      } else {
        playSound('beep');
      }
    } else if (this.currentBuySellError.length > 0) {
      this.resetAction();
    }
  }

  resetAction() {
    this.currentAction = CitySystem.actionType.NONE;
    this.currentActionChar = 0;
    this.currentBuySellAmount = '';
    this.currentBuySellError = '';
  }

  buyResources() {
    const amount = Math.round(this.currentBuySellAmount);
    const total = amount * this.pResources[this.currentActionChar - 1];

    if (total > this.currentPlayer.getMoney()) {
      this.currentBuySellError = getLabelText('CityBuy2');
      playSound('beep');
      return;
    }

    let tooMuch = false;
    switch (this.currentActionChar) {
      case 1:
        if (this.currentPlayer.getMen() + amount > 499) tooMuch = true;
        break;
      case 3:
        if (this.currentPlayer.getCannons() + amount > 149) tooMuch = true;
        break;
      case 4:
        if (this.currentPlayer.getGrain() + amount > 699) tooMuch = true;
        break;
      default:
        break;
    }
    if (tooMuch) {
      this.currentBuySellError = getLabelText('CityBuy3');
      playSound('beep');
      return;
    }

    if (this.currentBuySellError.length === 0) {
      this.currentPlayer.setMoney(this.currentPlayer.getMoney() - total);
      switch (this.currentActionChar) {
        case 1:
          this.currentPlayer.setMen(this.currentPlayer.getMen() + amount);
          break;
        case 2:
          this.currentPlayer.setReparation(this.currentPlayer.getReparation() + amount);
          break;
        case 3:
          this.currentPlayer.setCannons(this.currentPlayer.getCannons() + amount);
          break;
        case 4:
          this.currentPlayer.setGrain(this.currentPlayer.getGrain() + amount);
          break;
        default:
          break;
      }
      this.resetAction();
    }
  }

  sellResources() {
    const amount = Math.round(this.currentBuySellAmount);
    const total = amount * this.pResources[this.currentActionChar - 1];

    let tooMuch = false;
    switch (this.currentActionChar) {
      case 3:
        if (this.currentPlayer.getCannons() < amount) tooMuch = true;
        break;
      case 4:
        if (this.currentPlayer.getGrain() < amount) tooMuch = true;
        break;
      case 5:
        if (this.currentPlayer.getJewels() < amount) tooMuch = true;
        break;
      default:
        break;
    }
    if (tooMuch) {
      this.currentBuySellError = getLabelText('CitySell5');
      playSound('beep');
      return;
    }

    if (this.currentBuySellError.length === 0) {
      this.currentPlayer.setMoney(this.currentPlayer.getMoney() + total);
      switch (this.currentActionChar) {
        case 3:
          this.currentPlayer.setCannons(this.currentPlayer.getCannons() - amount);
          break;
        case 4:
          this.currentPlayer.setGrain(this.currentPlayer.getGrain() - amount);
          break;
        case 5:
          this.currentPlayer.setJewels(this.currentPlayer.getJewels() - amount);
          break;
        default:
          break;
      }
      this.resetAction();
    }
  }

  setNewCity(cityName) {
    this.currentCity = cityName;
    this.resetAction();

    for (let i = 0; i < 5; i += 1) {
      this.pResources[i] = Math.round((Math.random() + 0.8) * this.pStandard[i]);
    }
  }
}
