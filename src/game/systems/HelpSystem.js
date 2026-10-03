import { GameAction, CgaMode } from '../constants/enums.js';
import { getLabelText } from '../text/getLabelText.js';

export class HelpSystem {
  /**
   * @param {import('../host/GameHost.js').GameHost} host
   */
  constructor(host) {
    this.host = host;
    this.currentMenu = undefined;
    this.currentPage = undefined;
    this.pageEnd = undefined;
    this.resetMenu();
  }

  resetMenu() {
    this.currentMenu = 10;
    this.currentPage = 1;
  }

  hasHelpPage(menuNo, pageNo) {
    const firstLine = getLabelText(`HelpMenu${menuNo}_${pageNo}_1`);
    return typeof firstLine === 'string' && firstLine.length > 0;
  }

  /**
   * @param {import('../view/GameView.js').GameView} view
   */
  render(view) {
    view.setCgaMode(CgaMode.MODE1);

    if (this.currentMenu === 10) {
      for (let i = 0; i < 15; i += 1) {
        const key = `HelpMain${i + 1}`;
        if (getLabelText(key).length > 0) {
          view.drawLabel(key, 0, i * 16);
        }
      }
    } else if (this.currentMenu === 4 && (
      this.currentPage === 2
      || this.currentPage === 4
      || this.currentPage === 6
      || this.currentPage === 8
    )) {
      view.drawImage('shoot-help', 9, 0);
      view.drawLabel('Continue', 11, 0);
    } else {
      for (let i = 0; i < 25; i += 1) {
        const key = `HelpMenu${this.currentMenu}_${this.currentPage}_${i + 1}`;
        if (getLabelText(key).length > 0) {
          view.drawLabel(key, 0, i * 16);
          this.pageEnd = false;
        } else if (this.pageEnd) {
          view.drawLabel('Continue', 0, i * 16);
          break;
        } else {
          this.pageEnd = true;
        }
      }
    }
  }

  keyEvent(c) {
    let key = c;
    if (typeof key === 'number') {
      key = String.fromCharCode(key);
    }

    if (this.currentMenu === 10 && key >= '0' && key <= '9') {
      this.currentMenu = parseInt(key, 10);
    } else if (this.currentMenu === 10) {
      this.resetMenu();

      const mapValue = this.host.getMap().getCurrentMapDataValue();
      if (mapValue > 1 && mapValue < 9) {
        this.host.setCurrentAction(GameAction.CITY);
      } else {
        this.host.setCurrentAction(GameAction.MAP);
      }
    } else if (this.currentMenu !== 10) {
      const hasNextPage = this.hasHelpPage(this.currentMenu, this.currentPage + 1)
        || this.hasHelpPage(this.currentMenu, this.currentPage + 2);

      if (hasNextPage) {
        this.currentPage += 1;
      } else {
        this.resetMenu();
      }
    }
  }
}
