import { CitySystem } from '../game/systems/CitySystem.js';

/** @param {CitySystem} city */
export function getCityMobileMode(city) {
  if (!city) return 'menu';
  const err = city.currentBuySellError ?? '';
  if (err.length > 0) return 'error';
  const action = city.currentAction;
  if (action === CitySystem.actionType.NONE) return 'menu';
  if (action === CitySystem.actionType.SELL_1) return 'sell';
  if (action === CitySystem.actionType.BUY || action === CitySystem.actionType.SELL_2) {
    return 'amount';
  }
  return 'menu';
}
