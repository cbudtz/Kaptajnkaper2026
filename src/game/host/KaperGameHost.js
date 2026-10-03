import { GameAction, GameStep, CauseOfDeath, CgaMode, BoardState } from '../constants/enums.js';
import { GamePlayer } from '../player/GamePlayer.js';
import { MapSystem } from '../systems/MapSystem.js';
import { HarborSystem } from '../systems/HarborSystem.js';
import { CitySystem } from '../systems/CitySystem.js';
import { MistSystem } from '../systems/MistSystem.js';
import { PromoteSystem } from '../systems/PromoteSystem.js';
import { HelpSystem } from '../systems/HelpSystem.js';
import { AttackSystem } from '../systems/AttackSystem.js';
import { setActiveLocale, getActiveLocale } from '../../i18n/index.js';
import {
  isGameSoundEnabled,
  setGameSoundEnabled,
  toggleGameSound,
} from '../audio/soundState.js';
import { playSound } from '../audio/playSound.js';

export class KaperGameHost {
  constructor() {
    this.currentVersion = '1 Release 4';
    this.titleMusicPlayed = false;
    this.animationRepaint = false;
    this.currentStep = GameStep.INTRO_WELCOME;
    this.currentAction = GameAction.MAP;
    this.endScreenInputUnlockedAt = 0;
    this.highScoreStorageKey = 'kaptajnkaper.rec.v1';
    this.legacyHighScoreStorageKey = 'privateer.highscore.v1';
    this.highScore = { score: 0, name: '' };
    this.needsRender = true;

    this.player = new GamePlayer(this);
    this.map = new MapSystem(this);
    this.promote = new PromoteSystem(this);
    this.mist = new MistSystem(this);
    this.attack = new AttackSystem(this);
    this.harbor = new HarborSystem(this);
    this.city = new CitySystem(this);
    this.help = new HelpSystem(this);

    this.loadHighScore();
  }

  getCurrentPlayer() {
    return this.player;
  }

  getCurrentAction() {
    return this.currentAction;
  }

  setCurrentAction(action) {
    this.currentAction = action;
    this.markDirty();
  }

  setCurrentStep(step) {
    const wasEndScreen = this.currentStep === GameStep.GAME_LOST || this.currentStep === GameStep.HIGHSCORE;
    const isEndScreen = step === GameStep.GAME_LOST || step === GameStep.HIGHSCORE;

    this.currentStep = step;

    if (step === GameStep.TITLE_SCREEN && !this.titleMusicPlayed) {
      this.titleMusicPlayed = true;
      playSound('intro');
    }
    if (step === GameStep.INTRO_WELCOME) {
      this.titleMusicPlayed = false;
    }
    if (step === GameStep.HIGHSCORE) {
      this.trySetHighScore(this.player.getScore(), this.player.getName());
    }
    if (isEndScreen && !wasEndScreen) {
      this.endScreenInputUnlockedAt = Date.now() + 5000;
    } else if (!isEndScreen) {
      this.endScreenInputUnlockedAt = 0;
    }
    this.markDirty();
  }

  getMap() {
    return this.map;
  }

  getHarbor() {
    return this.harbor;
  }

  getCity() {
    return this.city;
  }

  markDirty() {
    this.needsRender = true;
  }

  /**
   * @param {import('../view/PhaserGameView.js').PhaserGameView} view
   */
  render(view) {
    view.beginFrame();
    this.needsRender = false;

    switch (this.currentStep) {
      case GameStep.INTRO_WELCOME:
        view.setCgaMode(CgaMode.MODE1);
        view.drawLabel('Welcome1', 128, 24);
        view.drawLabel('Welcome2', 128, 48);
        view.drawLabel('Welcome3', 96, 72);
        {
          const recordName = this.highScore.name?.length ? this.highScore.name : 'Nelson himself!';
          const recordValue = this.highScore.score || 256;
          view.drawLabelRaw('REKORD:', 192, 112);
          view.drawLabel('RecordLabel', 144, 144);
          view.drawLabel('RecordHolderLabel', 144, 160);
          view.drawLabelRaw(`${recordValue}`.padStart(5, ' '), 96, 144);
          view.drawLabelRaw(recordName, 144, 176);
        }
        view.drawLabel('Welcome8', 64, 240);
        view.drawLabel('Welcome9', 96, 272);
        view.drawLabel('Welcome10', 96, 288);
        break;

      case GameStep.INTRO_SOUND:
        view.setCgaMode(CgaMode.MODE1);
        view.drawLabel('SoundIntro1', 32, 64);
        view.drawLabel('SoundIntro2', 160, 80);
        view.drawLabel('SoundIntro3', 64, 128);
        view.drawLabel('SoundIntro4', 64, 176);
        view.drawLabel('SoundIntro5', 64, 192);
        view.drawLabel('SoundIntro6', 64, 240);
        view.drawLabelRaw(isGameSoundEnabled() ? '1' : '0', 240, 240);
        view.drawLabel('SoundIntro7', 64, 272);
        break;

      case GameStep.INTRO_ENTER_NAME:
        view.setCgaMode(CgaMode.MODE1);
        view.drawLabel('PlayerName1', 0, 48);
        view.drawImage('ship-map-mode1', 200, 48);
        view.drawLabel('PlayerName2', 0, 96);
        {
          const showCursor = Date.now() % 1000 < 500;
          const cursorChar = showCursor ? String.fromCharCode(219) : ' ';
          view.drawLabelRaw(this.player.getName() + cursorChar, 160, 96);
        }
        view.drawLabel('PlayerName3', 0, 256);
        view.drawLabel('PlayerName4', 0, 288);
        break;

      case GameStep.TITLE_SCREEN: {
        const titleKey = getActiveLocale() === 'en' ? 'title-en' : 'title-da';
        view.drawImage(titleKey, 12, 0);
        view.drawLabel('Continue', 0, 384);
        break;
      }

      case GameStep.GAME_PLAYING:
        switch (this.currentAction) {
          case GameAction.MAP:
            this.map.render(view);
            break;
          case GameAction.PROMOTE:
            this.promote.render(view);
            break;
          case GameAction.MIST:
            this.mist.render(view);
            break;
          case GameAction.ATTACK:
            this.attack.render(view);
            break;
          case GameAction.HARBOR:
            this.harbor.render(view);
            break;
          case GameAction.CITY:
            this.city.render(view);
            break;
          case GameAction.HELP:
            this.help.render(view);
            break;
          default:
            break;
        }
        break;

      case GameStep.GAME_LOST: {
        view.setCgaMode(CgaMode.MODE2);
        let moreLines = 0;
        if (this.player.getDeathReason() === CauseOfDeath.TOO_MANY_MOVES) {
          view.drawLabel('CauseOfDeath_TOO_MANY_MOVES1', 0, 0);
          view.drawLabel('CauseOfDeath_TOO_MANY_MOVES2', 0, 32);
          view.drawLabel('CauseOfDeath_TOO_MANY_MOVES3', 0, 64);
          view.drawLabel('CauseOfDeath_TOO_MANY_MOVES4', 0, 80);
          view.drawLabel('CauseOfDeath_TOO_MANY_MOVES5', 0, 112);
        } else {
          view.drawLabel('EndGame1', 0, 64);
          view.drawLabel('EndGame2', 0, 80);
          view.drawLabel('EndGame3', 0, 96, this.player.getScore(), this.player.getMoney());
          if (this.player.getDeathReason() !== CauseOfDeath.TOO_FEW_RESOURCES) {
            view.drawLabel(`CauseOfDeath_${this.player.getDeathReason()}`, 0, 144);
            view.drawLabel('CauseOfDeath', 0, 160);
            moreLines = 64;
          }
        }
        view.drawLabel('EndGame4', 0, 144 + moreLines, this.player.getMen());
        view.drawLabel('EndGame5', 0, 160 + moreLines, this.player.getReparation());
        view.drawLabel('Continue', 0, 176 + moreLines);
        break;
      }

      case GameStep.HIGHSCORE:
        view.setCgaMode(CgaMode.MODE2);
        {
          const highScoreHolder = this.highScore.name?.length ? this.highScore.name : 'Nelson himself!';
          view.drawLabel('HighScore1', 192, 160, this.player.getScore());
          view.drawLabel('RecordLabel', 192, 192, this.highScore.score);
          view.drawLabel('RecordHolderLabel', 192, 208, highScoreHolder);
          view.drawLabel('HighScore2', 0, 336);
        }
        break;

      default:
        break;
    }
  }

  /** @param {KeyboardEvent} event */
  handleKey(event) {
    const c = this.normalizeKey(event);
    const endScreenLocked = Date.now() < this.endScreenInputUnlockedAt;

    if (c === 'F1' || c === 'F2' || c === 'Escape') {
      event.preventDefault?.();
      event.stopPropagation?.();
    }

    switch (this.currentStep) {
      case GameStep.INTRO_WELCOME:
        if (c.toLowerCase() === 'e') {
          setActiveLocale('en');
          this.setCurrentStep(GameStep.INTRO_SOUND);
        } else if (c.toLowerCase() === 'c') {
          this.clearHighScore();
        } else if (c.length === 1 && c !== 'C') {
          setActiveLocale('da');
          this.setCurrentStep(GameStep.INTRO_SOUND);
        }
        break;

      case GameStep.INTRO_SOUND:
        if (c === 'F2') toggleGameSound();
        else if (c === '0') {
          setGameSoundEnabled(false);
          this.setCurrentStep(GameStep.TITLE_SCREEN);
        } else if (c === '1') {
          setGameSoundEnabled(true);
          this.setCurrentStep(GameStep.TITLE_SCREEN);
        } else if (c === 'Enter') {
          this.setCurrentStep(GameStep.TITLE_SCREEN);
        }
        break;

      case GameStep.INTRO_ENTER_NAME:
        if (c === 'Enter' && this.player.getName().length > 0) {
          this.setCurrentStep(GameStep.GAME_PLAYING);
        } else if (c === 'Backspace') {
          if (this.player.getName().length > 0) {
            this.player.setName(this.player.getName().substring(0, this.player.getName().length - 1));
          }
        } else if (c.length === 1) {
          this.player.setName(this.player.getName() + c);
        }
        break;

      case GameStep.TITLE_SCREEN:
        this.setCurrentStep(GameStep.INTRO_ENTER_NAME);
        break;

      case GameStep.GAME_PLAYING:
        if (c === 'F2') {
          toggleGameSound();
          break;
        }
        switch (this.currentAction) {
          case GameAction.MAP:
            this.map.keyEvent(c);
            break;
          case GameAction.PROMOTE:
            this.promote.keyEvent(c);
            break;
          case GameAction.MIST:
            this.mist.keyEvent(c);
            break;
          case GameAction.ATTACK:
            this.attack.keyEvent(c);
            break;
          case GameAction.HARBOR:
            this.harbor.keyEvent(c);
            break;
          case GameAction.CITY:
            this.city.keyEvent(c);
            break;
          case GameAction.HELP:
            this.help.keyEvent(c);
            break;
          default:
            break;
        }
        break;

      case GameStep.GAME_LOST:
        if (!endScreenLocked) this.setCurrentStep(GameStep.HIGHSCORE);
        break;

      case GameStep.HIGHSCORE:
        if (!endScreenLocked) {
          this.player.resetPlayer();
          this.map.resetMap();
          this.setCurrentAction(GameAction.MAP);
          this.setCurrentStep(GameStep.INTRO_WELCOME);
        }
        break;

      default:
        break;
    }
    this.markDirty();
  }

  /** Animation / blink tick (replaces legacy setTimeout run loop). */
  tick() {
    let interval = 200;

    if (
      this.animationRepaint
      && this.currentAction === GameAction.ATTACK
      && this.attack.getCurrentBoard().getCurrentState() === BoardState.SHIP_ANIMATION
    ) {
      this.attack.getCurrentBoard().showShipAnimation();
      interval = 20;
      this.markDirty();
    } else if (
      this.animationRepaint
      && this.currentAction === GameAction.ATTACK
      && this.attack.getCurrentBoard().getCurrentState() === BoardState.FLAG_ANIMATION
    ) {
      this.attack.getCurrentBoard().showFlagAnimation();
      interval = 10;
      this.markDirty();
    } else if (
      this.animationRepaint
      && this.currentAction === GameAction.HARBOR
      && this.harbor.getCurrentAction() === HarborSystem.actionType.SAILING
    ) {
      this.harbor.showSailingAnimation();
      interval = 150 - (this.player.getDifficulty() - 2) * 2;
      this.markDirty();
    } else if (
      this.currentStep === GameStep.INTRO_ENTER_NAME
      || this.currentStep === GameStep.INTRO_SOUND
    ) {
      interval = 100;
      this.markDirty();
    }

    return interval;
  }

  normalizeKey(e) {
    let key = e.key;
    if (e.location === 3) {
      const map = {
        Numpad0: '0',
        Numpad1: '1',
        Numpad2: '2',
        Numpad3: '3',
        Numpad4: '4',
        Numpad5: '5',
        Numpad6: '6',
        Numpad7: '7',
        Numpad8: '8',
        Numpad9: '9',
        NumpadEnter: 'Enter',
      };
      if (map[e.code]) return map[e.code];
    }
    return key;
  }

  loadHighScore() {
    try {
      let raw = localStorage.getItem(this.highScoreStorageKey);
      if (!raw) raw = localStorage.getItem(this.legacyHighScoreStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.score === 'number') {
        this.highScore.score = Math.max(0, Math.floor(parsed.score));
        this.highScore.name = parsed.name ? `${parsed.name}` : '';
      }
    } catch {
      /* ignore */
    }
  }

  saveHighScore() {
    try {
      localStorage.setItem(this.highScoreStorageKey, JSON.stringify(this.highScore));
    } catch {
      /* ignore */
    }
  }

  clearHighScore() {
    this.highScore.score = 0;
    this.highScore.name = '';
    try {
      localStorage.removeItem(this.highScoreStorageKey);
    } catch {
      /* ignore */
    }
    this.markDirty();
  }

  trySetHighScore(score, name) {
    const normalizedScore = Math.max(0, Math.floor(score || 0));
    if (normalizedScore <= this.highScore.score) return;
    this.highScore.score = normalizedScore;
    this.highScore.name = name ? `${name}` : '';
    this.saveHighScore();
  }
}
