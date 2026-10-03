/**
 * @typedef {object} GameHost
 * @property {boolean} animationRepaint
 * @property {() => import('../player/GamePlayer.js').GamePlayer} getCurrentPlayer
 * @property {() => number} getCurrentAction
 * @property {(action: number) => void} setCurrentAction
 * @property {(step: number) => void} setCurrentStep
 * @property {() => import('../systems/MapSystem.js').MapSystem} getMap
 */

export {};
