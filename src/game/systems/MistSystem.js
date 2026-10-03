import { GameAction, CgaMode } from '../constants/enums.js';
import { playSound } from '../../audio/GameAudio.js';
import { getLabelText } from '../text/getLabelText.js';

export class MistSystem {
  /**
   * @param {import('../host/GameHost.js').GameHost} host
   */
  constructor(host) {
    this.host = host;
    this.currentPlayer = host.getCurrentPlayer();

    this.currentMist = 0;
    this.currentAmount = 0;
  }

  /**
   * @param {import('../view/GameView.js').GameView} view
   */
  render(view) {
    view.setCgaMode(CgaMode.MODE2);
    this.host.getMap().render(view);

    if (this.currentMist === 0) {
      view.drawLabel('Mist1', 0, 0);
      view.drawLabel('Mist2', 0, 16);
      view.drawLabel('Mist3', 0, 32);
      view.drawLabel('Mist4', 0, 48);
      view.drawLabel('Mist5', 0, 64);
      view.drawLabel('Mist6', 0, 80);
      view.drawLabel(
        'Mist7',
        0,
        112,
        this.currentPlayer.getRankType1(),
        this.currentPlayer.getName(),
      );
      view.drawLabel('Mist8', 0, 128);
      view.drawLabel('Mist9', 0, 160);
    } else {
      playSound('b5th');
      let moreLines = 0;

      view.drawLabel(`MistType${this.currentMist}1`, 0, 0);
      if (this.currentMist === 3 || this.currentMist === 4) {
        view.drawLabel(`MistType${this.currentMist}2`, 0, 16, this.currentAmount);
      } else {
        view.drawLabelRaw(getLabelText(`MistType${this.currentMist}2`), 0, 16);
      }

      if (this.currentMist > 4) {
        if (this.currentMist === 5) {
          view.drawLabel(`MistType${this.currentMist}3`, 0, 32, this.currentAmount);
        } else {
          view.drawLabelRaw(getLabelText(`MistType${this.currentMist}3`), 0, 32);
        }
        moreLines += 16;
      }
      if (this.currentMist > 7) {
        view.drawLabel(`MistType${this.currentMist}4`, 0, 48);
        view.drawLabel(`MistType${this.currentMist}5`, 0, 64);
        view.drawLabel(`MistType${this.currentMist}6`, 0, 80);
        moreLines += 48;
      }

      view.drawLabel('Continue', 0, 48 + moreLines);
    }
  }

  keyEvent(c) {
    if (this.currentMist === 0) {
      this.currentPlayer.addToExperience();

      const yes = getLabelText('QuestionY').charAt(0);
      const no = getLabelText('QuestionN').charAt(0);

      if (c.toLowerCase() === yes) {
        this.investigateMist();
      } else if (c.toLowerCase() === no) {
        this.host.setCurrentAction(GameAction.MAP);
      } else {
        playSound('beep');
      }
    } else if (this.currentMist === 1) {
      this.currentMist = 0;
      this.currentAmount = 0;
      this.host.setCurrentAction(GameAction.ATTACK);
    } else {
      this.currentMist = 0;
      this.currentAmount = 0;
      this.host.setCurrentAction(GameAction.MAP);
      this.currentPlayer.checkPlayerStatus();
    }
  }

  investigateMist() {
    let i = 1 + Math.floor(Math.random() * 9);
    this.currentMist = i;

    if (this.currentMist > 2) {
      this.currentMist -= 1;
    }

    switch (this.currentMist) {
      case 3:
        this.currentAmount = 2 + Math.floor(Math.random() * 6);
        this.currentPlayer.setGrain(this.currentPlayer.getGrain() + this.currentAmount);
        break;

      case 4:
        this.currentAmount = 2 + Math.floor(Math.random() * 6);
        this.currentPlayer.setJewels(this.currentPlayer.getJewels() + this.currentAmount);
        break;

      case 5:
        this.currentAmount = 600;
        this.currentPlayer.setMoney(this.currentPlayer.getMoney() + this.currentAmount);
        break;

      case 6:
        this.currentPlayer.setCannons(this.currentPlayer.getCannons() + 1);
        break;

      case 7:
        this.currentAmount = 9 + Math.floor(Math.random() * 40);
        this.currentPlayer.setMen(this.currentPlayer.getMen() + this.currentAmount);
        break;

      case 8: {
        let men = this.currentPlayer.getMen();
        men -= men / 3;
        this.currentPlayer.setMen(men);
        break;
      }

      default:
        break;
    }
  }
}
