import { GameAction, GameStep, CgaMode } from '../constants/enums.js';

export class PromoteSystem {
  /**
   * @param {import('../host/GameHost.js').GameHost} host
   */
  constructor(host) {
    this.host = host;
    this.currentPlayer = host.getCurrentPlayer();
  }

  /**
   * @param {import('../view/GameView.js').GameView} view
   */
  render(view) {
    view.setCgaMode(CgaMode.MODE2);
    view.drawLabel('Promote1', 0, 0);
    view.drawLabel('Promote2', 0, 32);
    view.drawLabel('Promote3', 0, 48);
    view.drawLabel('Promote4', 0, 80);

    let moreLines = 0;

    if (this.currentPlayer.getDifficulty() < 9) {
      view.drawLabel('Promote5', 0, 96);
      view.drawLabel(
        'Promote6',
        0,
        112,
        this.currentPlayer.getRankType2(),
        this.currentPlayer.getName(),
      );
    } else {
      view.drawLabel('Promote7', 0, 96);
      view.drawLabel('Promote8', 0, 112);
      view.drawLabel('EndGame4', 0, 144, this.currentPlayer.getMen());
      view.drawLabel('EndGame5', 0, 160, this.currentPlayer.getReparation());
      moreLines = 48;
    }

    view.drawLabel('Continue', 0, 128 + moreLines);
  }

  keyEvent() {
    this.host.setCurrentAction(GameAction.MAP);

    if (this.currentPlayer.getDifficulty() === 10) {
      this.host.setCurrentStep(GameStep.HIGHSCORE);
    }
  }
}
