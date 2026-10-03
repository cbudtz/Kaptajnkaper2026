import { describe, expect, it } from 'vitest';
import { computeMobileLayout, REFERENCE_VIEWPORT } from '../src/input/mobileLayout.js';

describe('computeMobileLayout', () => {
  it('fills reference viewport 390×844 with no leftover gap', () => {
    const { width, height } = REFERENCE_VIEWPORT;
    const layout = computeMobileLayout(width, height);
    expect(layout.gameBandHeight + layout.deckHeight).toBe(height);
    expect(layout.gameBandHeight).toBe(Math.round(width * (400 / 640)));
    expect(layout.deckHeight).toBeGreaterThanOrEqual(220);
  });

  it('adapts when browser chrome reduces height to 390×700', () => {
    const layout = computeMobileLayout(390, 700);
    expect(layout.gameBandHeight + layout.deckHeight).toBe(700);
    expect(layout.deckHeight).toBeGreaterThanOrEqual(220);
  });
});
