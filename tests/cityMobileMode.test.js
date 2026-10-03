import { describe, expect, it } from 'vitest';
import { CitySystem } from '../src/game/systems/CitySystem.js';
import { getCityMobileMode } from '../src/input/cityMobileMode.js';

describe('getCityMobileMode', () => {
  it('returns amount when buying in city', () => {
    const host = { getCurrentPlayer: () => ({}) };
    const city = new CitySystem(host);
    city.currentAction = CitySystem.actionType.BUY;
    expect(getCityMobileMode(city)).toBe('amount');
  });
});
