import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import GameScene from './scenes/GameScene.js';
import { GAME_WIDTH, GAME_HEIGHT } from './config/assets.js';
import './i18n/index.js';
import './styles/mobile.css';
import { initMobileShell } from './input/mobileControls.js';

initMobileShell();

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#000028',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
  },
  scene: [BootScene, PreloadScene, GameScene],
  pixelArt: true,
  roundPixels: true,
  input: {
    activePointers: 3,
  },
  render: {
    antialias: false,
    powerPreference: 'high-performance',
  },
};

const game = new Phaser.Game(config);
window.addEventListener('kaper-mobile-layout', () => {
  game.scale.refresh();
});
