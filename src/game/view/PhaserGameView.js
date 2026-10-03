import { CgaMode } from '../constants/enums.js';
import { CgaLabelFactory } from './CgaLabelFactory.js';

const GAME_WIDTH = 640;
const GAME_HEIGHT = 400;
const BG = 0x0000a8;

export class PhaserGameView {
  /**
   * @param {import('phaser').Scene} scene
   * @param {Phaser.GameObjects.Container} container
   */
  constructor(scene, container) {
    this.scene = scene;
    this.container = container;
    this.labels = new CgaLabelFactory(scene);
    this.cgaMode = CgaMode.MODE1;
  }

  beginFrame() {
    this.container.removeAll(true);
    const bg = this.scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, BG).setOrigin(0);
    this.container.add(bg);
  }

  /** @param {import('../constants/enums.js').CgaMode} mode */
  setCgaMode(mode) {
    this.cgaMode = mode;
    this.labels.setMode(mode);
  }

  drawImage(textureKey, x, y) {
    const sprite = this.scene.add.image(x, y, textureKey).setOrigin(0);
    this.container.add(sprite);
  }

  drawImageCrop(textureKey, dx, dy, dw, dh, sx, sy, sw, sh) {
    const sprite = this.scene.add
      .image(dx, dy, textureKey)
      .setOrigin(0)
      .setCrop(sx, sy, sw, sh)
      .setDisplaySize(dw, dh);
    this.container.add(sprite);
  }

  drawLabel(resourceKey, x, y, replace0, replace1) {
    const key = this.labels.getLabelTexture(resourceKey, replace0, replace1);
    this.drawImage(key, x, y);
  }

  drawLabelRaw(text, x, y) {
    const key = this.labels.getRawTexture(text);
    this.drawImage(key, x, y);
  }

  fillRect(x, y, w, h, color = BG) {
    const rect = this.scene.add.rectangle(x, y, w, h, color).setOrigin(0);
    this.container.add(rect);
  }
}
