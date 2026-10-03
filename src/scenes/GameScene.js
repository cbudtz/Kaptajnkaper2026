import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/assets.js';
import { KaperGameHost } from '../game/host/KaperGameHost.js';
import { PhaserGameView } from '../game/view/PhaserGameView.js';
import { ensureGameAudioUnlocked } from '../game/audio/playSound.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.host = new KaperGameHost();

    this.world = this.add.container(0, 0);
    this.view = new PhaserGameView(this, this.world);
    this.layoutWorld();
    this.scale.on('resize', () => this.layoutWorld());

    this.game.canvas.setAttribute('tabindex', '0');
    this.game.canvas.focus();
    this.input.on('pointerdown', () => {
      this.game.canvas.focus();
      ensureGameAudioUnlocked();
    });

    this.input.keyboard.on('keydown', (event) => {
      ensureGameAudioUnlocked();
      this.host.handleKey(event);
    });

    this.scheduleTick(this.host.tick());
    this.host.render(this.view);
  }

  layoutWorld() {
    const scale = Math.min(this.scale.width / GAME_WIDTH, this.scale.height / GAME_HEIGHT);
    const displayW = GAME_WIDTH * scale;
    const displayH = GAME_HEIGHT * scale;
    this.world.setPosition(
      (this.scale.width - displayW) / 2,
      (this.scale.height - displayH) / 2,
    );
    this.world.setScale(scale);
  }

  scheduleTick(delayMs) {
    this.time.addEvent({
      delay: delayMs,
      callback: () => {
        const next = this.host.tick();
        if (this.host.needsRender) {
          this.host.render(this.view);
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
