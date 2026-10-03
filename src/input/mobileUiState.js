import { GameStep, GameAction } from '../game/constants/enums.js';

/** @typedef {{ step: number, action: number, cityMode?: string, attackMode?: string }} GameUiState */

/**
 * Which mobile control panel to show for the current game state.
 * @param {GameUiState} state
 */
export function getMobilePanelForState(state) {
  const { step, action } = state;

  if (step === GameStep.INTRO_WELCOME) return 'intro';
  if (step === GameStep.INTRO_SOUND) return 'sound';
  if (step === GameStep.INTRO_ENTER_NAME) return 'name';
  if (step === GameStep.TITLE_SCREEN) return 'title';
  if (step === GameStep.GAME_LOST || step === GameStep.HIGHSCORE) return 'end';

  if (step === GameStep.GAME_PLAYING) {
    if (action === GameAction.MAP) return 'play-map';
    if (action === GameAction.HARBOR) return 'play-harbor';
    if (action === GameAction.CITY) {
      switch (state.cityMode) {
        case 'amount':
          return 'play-city-amount';
        case 'sell':
          return 'play-city-sell';
        case 'error':
          return 'play-city-error';
        default:
          return 'play-city';
      }
    }
    if (action === GameAction.ATTACK) {
      switch (state.attackMode) {
        case 'tactic':
          return 'play-attack-tactic';
        case 'shoot':
          return 'play-attack-shoot';
        case 'board':
          return 'play-attack-board';
        case 'surrender':
          return 'play-attack-surrender';
        case 'won':
        case 'continue':
          return 'play-attack-continue';
        case 'wait':
          return 'play-attack-wait';
        default:
          return 'play-attack-initial';
      }
    }
    return 'play-menu';
  }

  return 'end';
}
