import { describe, expect, it } from 'vitest';
import { NAVIGATION_DPAD } from '../src/input/mobileLayouts.js';

describe('NAVIGATION_DPAD', () => {
  it('matches numpad compass layout with south on bottom center', () => {
    expect(NAVIGATION_DPAD).toEqual([
      ['7', '8', '9'],
      ['4', null, '6'],
      ['1', '2', '3'],
    ]);
  });
});
