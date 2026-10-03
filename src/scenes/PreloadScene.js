import Phaser from 'phaser';
import { IMAGE_ASSETS } from '../config/assets.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    for (const [key, path] of IMAGE_ASSETS) {
      this.load.image(key, path);
    }
  }

  create() {
    this.scene.start('GameScene');
  }
}
