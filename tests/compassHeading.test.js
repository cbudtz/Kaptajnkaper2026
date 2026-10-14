import { describe, expect, it } from 'vitest';
import {
  headingKeyToDegrees,
  normalizeMoveHeadingKey,
  updateCompassRoseHeading,
} from '../src/input/compassHeading.js';

describe('compassHeading', () => {
  it('maps move keys and arrows to compass degrees', () => {
    expect(normalizeMoveHeadingKey('ArrowUp')).toBe('8');
    expect(headingKeyToDegrees('8')).toBe(0);
    expect(headingKeyToDegrees('6')).toBe(90);
    expect(headingKeyToDegrees('2')).toBe(180);
  });

  it('rotates the compass arrow on the deck', () => {
    document.body.innerHTML = `
      <div id="mobile-deck">
        <div class="mobile-dpad-compass"><span class="mobile-dpad-compass-arrow"></span></div>
      </div>`;
    const deck = document.getElementById('mobile-deck');
    updateCompassRoseHeading(deck, '6');
    const compass = deck.querySelector('.mobile-dpad-compass');
    expect(compass?.classList.contains('has-heading')).toBe(true);
    expect(compass?.style.getPropertyValue('--compass-heading-deg')).toBe('90deg');
  });
});
