import { describe, expect, it } from 'vitest';
import { NAVIGATION_DPAD, createCompassRoseElement } from '../src/input/mobileLayouts.js';

describe('NAVIGATION_DPAD', () => {
  it('matches numpad compass layout with south on bottom center', () => {
    expect(NAVIGATION_DPAD).toEqual([
      ['7', '8', '9'],
      ['4', null, '6'],
      ['1', '2', '3'],
    ]);
  });

  it('renders subtle compass labels in the center cell', () => {
    const el = createCompassRoseElement();
    expect(el.querySelector('.mobile-dpad-compass-n')?.textContent).toBe('N');
    expect(el.querySelector('.mobile-dpad-compass-e')?.textContent).toBe('Ø');
  });
});
