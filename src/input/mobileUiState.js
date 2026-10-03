import { GameStep, GameAction } from '../game/constants/enums.js';

/** @typedef {{ step: number, action: number }} GameUiState */

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
    if (action === GameAction.CITY) return 'play-city';
    if (action === GameAction.ATTACK) return 'play-attack';
    return 'play-menu';
  }

  return 'end';
}
