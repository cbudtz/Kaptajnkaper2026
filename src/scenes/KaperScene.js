import Phaser from 'phaser';

const GAME_WIDTH = 640;
const GAME_HEIGHT = 400;

const IMAGE_MANIFEST = [
  ['ship-board-en', 'images/ship-board-en.png'],
  ['ship-board-da', 'images/ship-board-da.png'],
  ['flag-pole', 'images/flag-pole.png'],
  ['flag-pirate', 'images/flag-pirate.png'],
  ['flag-en', 'images/flag-en.png'],
  ['font-mode1', 'images/font-mode1.png'],
  ['font-mode2', 'images/font-mode2.png'],
  ['ship-harbor', 'images/ship-harbor.png'],
  ['harbor-border-bottom', 'images/harbor-border-bottom.png'],
  ['harbor-border', 'images/harbor-border.png'],
  ['ship-map-mode2', 'images/ship-map-mode2.png'],
  ['shoot-help', 'images/shoot-help.png'],
  ['ship-map-mode1', 'images/ship-map-mode1.png'],
  ['title-da', 'images/title-da.png'],
  ['title-en', 'images/title-en.png'],
  ['shoot', 'images/shoot.png'],
  ['shoot-wind', 'images/shoot-wind.png'],
  ['shoot-cross', 'images/shoot-cross.png'],
  ['shoot-hit', 'images/shoot-hit.png'],
  ['shoot-miss1', 'images/shoot-miss1.png'],
  ['shoot-miss2', 'images/shoot-miss2.png'],
  ['map-mode2', 'images/map-mode2.png'],
  ['map-mode1', 'images/map-mode1.png'],
];

export default class KaperScene extends Phaser.Scene {
  constructor() {
    super({ key: 'KaperScene' });
    /** @type {import('../legacy/kaper.js').kaper | null} */
    this.app = null;
  }

  preload() {
    for (const [key, path] of IMAGE_MANIFEST) {
      this.load.image(key, path);
    }
  }

  create() {
    bindLegacyImages(this);

    const canvasTexture = this.textures.createCanvas('kaper-frame', GAME_WIDTH, GAME_HEIGHT);
    const canvas = canvasTexture.getCanvas();
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    this.app = new kaper();
    this.app.osimg = canvas;
    this.app.init();
    this.app.repaint();
    this.app.run();

    const scale = Math.min(
      this.scale.width / GAME_WIDTH,
      this.scale.height / GAME_HEIGHT,
    );
    const displayW = GAME_WIDTH * scale;
    const displayH = GAME_HEIGHT * scale;

    this.gameSurface = this.add
      .image(this.scale.width / 2, this.scale.height / 2, 'kaper-frame')
      .setDisplaySize(displayW, displayH);

    this.game.canvas.setAttribute('tabindex', '0');
    this.game.canvas.focus();

    this.input.on('pointerdown', () => {
      this.game.canvas.focus();
      ensureQbasicAudioUnlocked();
    });

    this.input.keyboard.on('keydown', (event) => {
      ensureQbasicAudioUnlocked();
      this.app.keyPressed(event);
      canvasTexture.refresh();
    });

    this.scale.on('resize', () => this.layoutGameSurface(canvasTexture));
    this.layoutGameSurface(canvasTexture);
  }

  layoutGameSurface(canvasTexture) {
    const scale = Math.min(
      this.scale.width / GAME_WIDTH,
      this.scale.height / GAME_HEIGHT,
    );
    const displayW = GAME_WIDTH * scale;
    const displayH = GAME_HEIGHT * scale;
    this.gameSurface.setPosition(this.scale.width / 2, this.scale.height / 2);
    this.gameSurface.setDisplaySize(displayW, displayH);
    canvasTexture.refresh();
  }

  update() {
    if (!this.app) return;
    this.app.update();
    this.textures.get('kaper-frame').refresh();
  }
}
