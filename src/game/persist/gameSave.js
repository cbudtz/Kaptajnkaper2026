import { GameAction, GameStep } from '../constants/enums.js';
import { getActiveLocale, setActiveLocale } from '../../i18n/index.js';
import { isGameSoundEnabled, setGameSoundEnabled } from '../audio/soundState.js';

export const GAME_SAVE_STORAGE_KEY = 'kaptajnkaper.save.v1';
export const GAME_SAVE_VERSION = 1;

/** @param {import('../host/KaperGameHost.js').KaperGameHost} host */
export function serializeGameState(host) {
  const player = host.getCurrentPlayer();
  return {
    version: GAME_SAVE_VERSION,
    savedAt: Date.now(),
    locale: getActiveLocale(),
    soundEnabled: isGameSoundEnabled(),
    host: {
      currentStep: host.currentStep,
      currentAction: host.currentAction,
      titleMusicPlayed: host.titleMusicPlayed,
      animationRepaint: host.animationRepaint,
    },
    player: {
      name: player.getName(),
      score: player.getScore(),
      moves: player.getMoves(),
      difficulty: player.getDifficulty(),
      posX: player.getPosX(),
      posY: player.getPosY(),
      money: player.getMoney(),
      cannons: player.getCannons(),
      men: player.getMen(),
      reparation: player.getReparation(),
      jewels: player.getJewels(),
      grain: player.getGrain(),
      scoreToNextPromotion: player.getScoreToNextPromotion(),
      maxMovesBeforeNextPromotion: player.getMaxMovesBeforeNextPromotion(),
      eventExp: player.eventExp,
      battlesWon: player.battlesWon,
      battlesLost: player.battlesLost,
      prizeMen: player.prizeMen,
      prizeMoney: player.prizeMoney,
      deathReason: player.getDeathReason(),
      lastMoveHeadingKey: player.getLastMoveHeadingKey(),
    },
    map: {
      currentMapData: host.getMap().currentMapData,
    },
    city: snapshotCity(host.getCity()),
    harbor: snapshotHarbor(host.getHarbor()),
    mist: snapshotMist(host.mist),
    help: snapshotHelp(host.help),
    attack: snapshotAttack(host.attack),
  };
}

/** @param {import('../host/KaperGameHost.js').KaperGameHost} host */
export function shouldPersistGameState(host) {
  const step = host.currentStep;
  if (step === GameStep.GAME_LOST || step === GameStep.HIGHSCORE) return false;
  if (step === GameStep.INTRO_WELCOME) return false;
  return true;
}

/** @param {import('../host/KaperGameHost.js').KaperGameHost} host */
export function saveGameToLocalStorage(host) {
  if (typeof localStorage === 'undefined') return;
  if (!shouldPersistGameState(host)) return;
  try {
    localStorage.setItem(GAME_SAVE_STORAGE_KEY, JSON.stringify(serializeGameState(host)));
  } catch {
    // Quota / private mode — ignore.
  }
}

/** @param {import('../host/KaperGameHost.js').KaperGameHost} host */
export function clearSavedGame() {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(GAME_SAVE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * @param {import('../host/KaperGameHost.js').KaperGameHost} host
 * @returns {boolean}
 */
export function loadGameFromLocalStorage(host) {
  if (typeof localStorage === 'undefined') return false;
  let raw;
  try {
    raw = localStorage.getItem(GAME_SAVE_STORAGE_KEY);
  } catch {
    return false;
  }
  if (!raw) return false;
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    clearSavedGame();
    return false;
  }
  if (!data || data.version !== GAME_SAVE_VERSION) {
    clearSavedGame();
    return false;
  }
  if (data.host?.currentStep === GameStep.GAME_LOST || data.host?.currentStep === GameStep.HIGHSCORE) {
    clearSavedGame();
    return false;
  }

  try {
    applyGameState(host, data);
    return true;
  } catch {
    clearSavedGame();
    return false;
  }
}

/** @param {import('../host/KaperGameHost.js').KaperGameHost} host */
function applyGameState(host, data) {
  if (data.locale === 'en' || data.locale === 'da') {
    setActiveLocale(data.locale);
  }
  if (typeof data.soundEnabled === 'boolean') {
    setGameSoundEnabled(data.soundEnabled);
  }

  const h = data.host;
  host.currentStep = h.currentStep;
  host.currentAction = h.currentAction;
  host.titleMusicPlayed = !!h.titleMusicPlayed;
  host.animationRepaint = !!h.animationRepaint;
  host.endScreenInputUnlockedAt = 0;

  const p = data.player;
  const player = host.getCurrentPlayer();
  player.setName(p.name ?? '');
  player.score = p.score ?? 0;
  player.moves = p.moves ?? 0;
  player.difficulty = p.difficulty ?? 0;
  player.setPosX(p.posX ?? 10);
  player.setPosY(p.posY ?? 10);
  player.money = p.money ?? 600;
  player.cannons = p.cannons ?? 20;
  player.men = p.men ?? 200;
  player.reparation = p.reparation ?? 200;
  player.jewels = p.jewels ?? 0;
  player.grain = p.grain ?? 30;
  player.scoreToNextPromotion = p.scoreToNextPromotion ?? player.getScoreToNextPromotion();
  player.maxMovesBeforeNextPromotion = p.maxMovesBeforeNextPromotion ?? player.getMaxMovesBeforeNextPromotion();
  player.eventExp = p.eventExp ?? 2;
  player.battlesWon = p.battlesWon ?? 1;
  player.battlesLost = p.battlesLost ?? 1;
  player.prizeMen = p.prizeMen ?? 0;
  player.prizeMoney = p.prizeMoney ?? 0;
  player.deathReason = p.deathReason ?? 0;
  player.setLastMoveHeadingKey(p.lastMoveHeadingKey ?? null);

  if (data.map?.currentMapData) {
    host.getMap().currentMapData = data.map.currentMapData;
  }

  applyCity(host.getCity(), data.city);
  applyHarbor(host.getHarbor(), data.harbor);
  applyMist(host.mist, data.mist);
  applyHelp(host.help, data.help);
  applyAttack(host.attack, data.attack);

  host.markDirty();
}

function snapshotCity(city) {
  return {
    currentCity: city.currentCity,
    pResources: city.pResources,
    currentActionChar: city.currentActionChar,
    currentBuySellAmount: city.currentBuySellAmount,
    currentBuySellError: city.currentBuySellError,
    currentAction: city.currentAction,
  };
}

function applyCity(city, snap) {
  if (!snap) return;
  city.currentCity = snap.currentCity ?? '';
  city.pResources = snap.pResources ?? [0, 0, 0, 0, 0];
  city.currentActionChar = snap.currentActionChar;
  city.currentBuySellAmount = snap.currentBuySellAmount ?? '';
  city.currentBuySellError = snap.currentBuySellError ?? '';
  city.currentAction = snap.currentAction;
}

function snapshotHarbor(harbor) {
  return {
    collectPrizes: harbor.collectPrizes,
    currentCity: harbor.currentCity,
    currentAction: harbor.currentAction,
    currentWind: harbor.currentWind,
    harborShips: harbor.harborShips,
    playerShip: harbor.playerShip,
    harborHoleSize: harbor.harborHoleSize,
    harborHoleLocation: harbor.harborHoleLocation,
    playerMove: harbor.playerMove,
    showWindArrows: harbor.showWindArrows,
  };
}

function applyHarbor(harbor, snap) {
  if (!snap) return;
  Object.assign(harbor, {
    collectPrizes: snap.collectPrizes,
    currentCity: snap.currentCity,
    currentAction: snap.currentAction,
    currentWind: snap.currentWind,
    harborShips: snap.harborShips,
    playerShip: snap.playerShip,
    harborHoleSize: snap.harborHoleSize ?? 0,
    harborHoleLocation: snap.harborHoleLocation,
    playerMove: snap.playerMove,
    showWindArrows: snap.showWindArrows,
  });
}

function snapshotMist(mist) {
  return {
    currentMist: mist.currentMist,
    currentAmount: mist.currentAmount,
  };
}

function applyMist(mist, snap) {
  if (!snap) return;
  mist.currentMist = snap.currentMist ?? 0;
  mist.currentAmount = snap.currentAmount ?? 0;
}

function snapshotHelp(help) {
  return {
    currentMenu: help.currentMenu,
    currentPage: help.currentPage,
    pageEnd: help.pageEnd,
  };
}

function applyHelp(help, snap) {
  if (!snap) return;
  help.currentMenu = snap.currentMenu ?? 10;
  help.currentPage = snap.currentPage ?? 1;
  help.pageEnd = snap.pageEnd;
}

function snapshotAttack(attack) {
  const enemy = attack.currentEnemy;
  return {
    currentAttack: attack.currentAttack,
    sunkMen: attack.sunkMen,
    victorySoundPlayed: attack.victorySoundPlayed,
    enemy: {
      enemyType: enemy.enemyType,
      money: enemy.money,
      cannons: enemy.cannons,
      men: enemy.men,
      reparation: enemy.reparation,
      grain: enemy.grain,
      currentState: enemy.currentState,
    },
    shoot: snapshotShoot(attack.currentShoot),
    board: snapshotBoard(attack.currentBoard),
  };
}

function snapshotShoot(shoot) {
  return {
    enemyDistance: shoot.enemyDistance,
    windDirection: shoot.windDirection,
    windStrength: shoot.windStrength,
    shotSide: shoot.shotSide,
    shotElevation: shoot.shotElevation,
    enemyShots: shoot.enemyShots,
    playerShotSmall: shoot.playerShotSmall,
    playerShotLarge: shoot.playerShotLarge,
    showEnemyShots: shoot.showEnemyShots,
    showPlayerLargeShot: shoot.showPlayerLargeShot,
    currentState: shoot.currentState,
  };
}

function snapshotBoard(board) {
  return {
    shipY: board.shipY,
    flagY: board.flagY,
    playerMenLost: board.playerMenLost,
    enemyMenLost: board.enemyMenLost,
    playerMenShow: board.playerMenShow,
    enemyMenShow: board.enemyMenShow,
    playerMenLostShow: board.playerMenLostShow,
    enemyMenLostShow: board.enemyMenLostShow,
    currentState: board.currentState,
  };
}

function applyAttack(attack, snap) {
  if (!snap) return;
  attack.currentAttack = snap.currentAttack ?? attack.currentAttack;
  attack.sunkMen = snap.sunkMen ?? 0;
  attack.victorySoundPlayed = !!snap.victorySoundPlayed;
  if (snap.enemy) {
    Object.assign(attack.currentEnemy, snap.enemy);
  }
  applyShoot(attack.currentShoot, snap.shoot);
  applyBoard(attack.currentBoard, snap.board);
}

function applyShoot(shoot, snap) {
  if (!snap) return;
  Object.assign(shoot, snap);
}

function applyBoard(board, snap) {
  if (!snap) return;
  Object.assign(board, snap);
}

let saveTimer = null;

/** @param {import('../host/KaperGameHost.js').KaperGameHost} host */
export function scheduleSaveGame(host) {
  if (typeof window === 'undefined') return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    saveGameToLocalStorage(host);
  }, 400);
}
