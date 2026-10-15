import { beforeEach, describe, expect, it } from 'vitest';
import { KaperGameHost } from '../src/game/host/KaperGameHost.js';
import { GameAction, GameStep } from '../src/game/constants/enums.js';
import {
  GAME_SAVE_STORAGE_KEY,
  clearSavedGame,
  loadGameFromLocalStorage,
  saveGameToLocalStorage,
  serializeGameState,
} from '../src/game/persist/gameSave.js';

describe('gameSave', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('round-trips map play state through localStorage', () => {
    const host = new KaperGameHost();
    host.setCurrentStep(GameStep.GAME_PLAYING);
    host.setCurrentAction(GameAction.MAP);
    host.getCurrentPlayer().setName('Kaper');
    host.getCurrentPlayer().setPosX(12);
    host.getCurrentPlayer().setPosY(11);
    host.getMap().moveShip('6');

    saveGameToLocalStorage(host);
    const raw = localStorage.getItem(GAME_SAVE_STORAGE_KEY);
    expect(raw).toBeTruthy();

    const fresh = new KaperGameHost();
    expect(fresh.restoredFromSave).toBe(true);
    expect(fresh.currentStep).toBe(GameStep.GAME_PLAYING);
    expect(fresh.getCurrentAction()).toBe(GameAction.MAP);
    expect(fresh.getCurrentPlayer().getName()).toBe('Kaper');
    expect(fresh.getCurrentPlayer().getPosX()).toBe(13);
    expect(fresh.getCurrentPlayer().getLastMoveHeadingKey()).toBe('6');
  });

  it('does not restore finished game saves', () => {
    const host = new KaperGameHost();
    host.setCurrentStep(GameStep.GAME_LOST);
    saveGameToLocalStorage(host);
    expect(localStorage.getItem(GAME_SAVE_STORAGE_KEY)).toBeNull();

    host.setCurrentStep(GameStep.GAME_PLAYING);
    saveGameToLocalStorage(host);
    expect(localStorage.getItem(GAME_SAVE_STORAGE_KEY)).toBeTruthy();

    const data = JSON.parse(localStorage.getItem(GAME_SAVE_STORAGE_KEY));
    data.host.currentStep = GameStep.HIGHSCORE;
    localStorage.setItem(GAME_SAVE_STORAGE_KEY, JSON.stringify(data));

    clearSavedGame();
    localStorage.setItem(GAME_SAVE_STORAGE_KEY, JSON.stringify(data));
    const fresh = new KaperGameHost();
    expect(fresh.restoredFromSave).toBe(false);
    expect(fresh.currentStep).toBe(GameStep.INTRO_WELCOME);
  });

  it('serialize includes map grid', () => {
    const host = new KaperGameHost();
    host.setCurrentStep(GameStep.GAME_PLAYING);
    const snap = serializeGameState(host);
    expect(snap.map.currentMapData.length).toBeGreaterThan(0);
    expect(snap.version).toBe(1);
  });

  it('loadGameFromLocalStorage returns false when empty', () => {
    const host = new KaperGameHost();
    expect(loadGameFromLocalStorage(host)).toBe(false);
  });
});
