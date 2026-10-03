/** @see kaper.actionType in legacy/kaper.js */
export const GameAction = Object.freeze({
  MAP: 0,
  PROMOTE: 1,
  MIST: 2,
  ATTACK: 3,
  HARBOR: 4,
  CITY: 5,
  HELP: 6,
});

/** @see player.causeOfDeath in legacy/player.js */
export const CauseOfDeath = Object.freeze({
  NOT_YET: 0,
  TOO_MANY_MONEY: 1,
  TOO_MANY_MEN: 2,
  TOO_MANY_CANNONS: 3,
  TOO_MANY_GRAIN: 4,
  TOO_FEW_RESOURCES: 5,
  TOO_MANY_MOVES: 6,
});

/** @see cgafont.modes in legacy/cgafont.js */
export const CgaFontMode = Object.freeze({
  CGA_MODE1: 1,
  CGA_MODE2: 2,
});

/** @see attack.attackType in legacy/attack.js */
export const AttackType = Object.freeze({
  NONE: 0,
  ATTACK: 1,
  SHOOT: 2,
  BOARD: 3,
  WITHDRAW: 4,
  WON_SURRENDER: 5,
  WON_PRIZING: 6,
  WON_SUNK: 7,
});

/** @see attack.type in legacy/attack.js */
export const AttackOutcome = Object.freeze({
  LOST: 0,
  WON: 1,
});

/** @see enemy.stateType in legacy/enemy.js (values preserved from JS port) */
export const EnemyState = Object.freeze({
  GOOD: 0,
  SURRENDER: 0,
  SUNK: 0,
});

/** @see shoot.stateType in legacy/shoot.js */
export const ShootState = Object.freeze({
  SHOOTING: 0,
  SHOT: 1,
});

/** @see board.stateType in legacy/board.js */
export const BoardState = Object.freeze({
  SHIP_ANIMATION: 0,
  BOARDING: 1,
  FLAG_ANIMATION: 2,
});
