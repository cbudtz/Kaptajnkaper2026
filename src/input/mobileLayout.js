import { GAME_HEIGHT, GAME_WIDTH } from '../config/assets.js';

/** Reference phone size used for tuning (matches Playwright + common Android Chrome). */
export const REFERENCE_VIEWPORT = { width: 390, height: 844 };

/**
 * Split viewport into game band + control deck so they always fill the screen (no dead gap).
 * @param {number} viewportWidth
 * @param {number} viewportHeight
 */
export function computeMobileLayout(
  viewportWidth,
  viewportHeight,
  gameWidth = GAME_WIDTH,
  gameHeight = GAME_HEIGHT,
) {
  const minDeck = 220;
  const maxDeckRatio = 0.42;
  const aspectGameH = Math.round(viewportWidth * (gameHeight / gameWidth));

  let deckHeight = Math.round(
    Math.min(Math.max(viewportHeight * maxDeckRatio, minDeck), viewportHeight * 0.45),
  );
  let gameBandHeight = viewportHeight - deckHeight;

  if (gameBandHeight > aspectGameH) {
    gameBandHeight = aspectGameH;
    deckHeight = viewportHeight - gameBandHeight;
  }

  if (deckHeight < minDeck) {
    deckHeight = minDeck;
    gameBandHeight = Math.max(viewportHeight - deckHeight, Math.min(aspectGameH, viewportHeight - minDeck));
    deckHeight = viewportHeight - gameBandHeight;
  }

  return {
    viewportWidth,
    viewportHeight,
    gameBandHeight: Math.round(gameBandHeight),
    deckHeight: Math.round(deckHeight),
  };
}
