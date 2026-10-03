import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/assets.js';
import { KaperGameHost } from '../game/host/KaperGameHost.js';
import { PhaserGameView } from '../game/view/PhaserGameView.js';
import { ensureGameAudioUnlocked } from '../game/audio/playSound.js';
import { bindMobileControls, refreshMobileUi } from '../input/mobileControls.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.host = new KaperGameHost();

    this.world = this.add.container(0, 0);
    this.view = new PhaserGameView(this, this.world);

    const refreshLayout = () => {
      this.host.render(this.view);
    };
    this.scale.on('resize', refreshLayout);
    const onViewportChange = () => {
      this.scale.refresh();
      refreshLayout();
    };
    window.visualViewport?.addEventListener('resize', onViewportChange);
    window.addEventListener('kaper-mobile-layout', onViewportChange);

    this.game.canvas.setAttribute('tabindex', '0');
    this.game.canvas.focus();
    this.input.on('pointerdown', () => {
      this.game.canvas.focus();
      ensureGameAudioUnlocked();
    });

    const playerBridge = {
      setPlayerName: (name) => this.host.getCurrentPlayer().setName(name),
      getPlayerName: () => this.host.getCurrentPlayer().getName(),
      onNameChanged: () => {
        this.host.render(this.view);
      },
    };

    const getState = () => ({
      step: this.host.currentStep,
      action: this.host.currentAction,
    });

    const onKey = (event) => {
      ensureGameAudioUnlocked();
      this.host.handleKey(event);
      this.host.render(this.view);
      refreshMobileUi(getState, playerBridge);
    };

    if (this.input.keyboard) {
      this.input.keyboard.on('keydown', onKey);
    }

    bindMobileControls(onKey, getState, playerBridge);

    this.scheduleTick(this.host.tick());
    this.host.render(this.view);
    refreshMobileUi(getState, playerBridge);
  }

  scheduleTick(delayMs) {
    this.time.addEvent({
      delay: delayMs,
      callback: () => {
        const next = this.host.tick();
        if (this.host.needsRender) {
          this.host.render(this.view);
          refreshMobileUi(
            () => ({ step: this.host.currentStep, action: this.host.currentAction }),
            {
              getPlayerName: () => this.host.getCurrentPlayer().getName(),
              setPlayerName: (n) => this.host.getCurrentPlayer().setName(n),
            },
          );
        }
        this.scheduleTick(next);
      },
    });
  }

  update() {
    if (this.host?.needsRender) {
      this.host.render(this.view);
    }
  }
}
