import { describe, expect, it } from 'vitest';
import {
  COMPASS_ROSE_SVG,
  NAVIGATION_DPAD,
  createCompassRoseElement,
} from '../src/input/mobileLayouts.js';

describe('NAVIGATION_DPAD', () => {
  it('matches numpad compass layout with south on bottom center', () => {
    expect(NAVIGATION_DPAD).toEqual([
      ['7', '8', '9'],
      ['4', null, '6'],
      ['1', '2', '3'],
    ]);
  });

  it('renders a visible SVG compass in the center cell', () => {
    expect(COMPASS_ROSE_SVG).toContain('mobile-dpad-compass-svg');
    const el = createCompassRoseElement();
    expect(el.querySelector('.mobile-dpad-compass-svg')).toBeTruthy();
  });
});
