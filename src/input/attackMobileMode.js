import { AttackType, BoardState } from '../game/constants/enums.js';

/** @param {import('../game/systems/AttackSystem.js').AttackSystem} attack */
export function getAttackMobileMode(attack) {
  if (!attack) return 'initial';

  switch (attack.currentAttack) {
    case AttackType.NONE:
    case AttackType.WITHDRAW:
      return 'initial';
    case AttackType.ATTACK:
      return 'tactic';
    case AttackType.SHOOT:
      return 'shoot';
    case AttackType.BOARD: {
      const boardState = attack.getCurrentBoard().getCurrentState();
      if (boardState === BoardState.BOARDING) return 'board';
      return 'wait';
    }
    case AttackType.WON_SURRENDER:
      return 'surrender';
    case AttackType.WON_PRIZING:
    case AttackType.WON_SUNK:
      return 'won';
    default:
      return 'continue';
  }
}
