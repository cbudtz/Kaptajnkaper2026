import Phaser from 'phaser';
import KaperScene from './scenes/KaperScene.js';

import './legacy/qbasicplayer.js';
import './legacy/globals.js';
import './legacy/lang.js';
import './legacy/resources_da.js';
import './legacy/resources_en.js';
import './legacy/cgafont.js';
import './legacy/help.js';
import './legacy/harbor.js';
import './legacy/city.js';
import './legacy/board.js';
import './legacy/shoot.js';
import './legacy/promote.js';
import './legacy/enemy.js';
import './legacy/mist.js';
import './legacy/attack.js';
import './legacy/kaper.js';
import './legacy/player.js';
import './legacy/map.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#000028',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 640,
    height: 400,
  },
  scene: [KaperScene],
  pixelArt: true,
  roundPixels: true,
  audio: {
    disableWebAudio: false,
  },
};

// eslint-disable-next-line no-new
new Phaser.Game(config);

window.addEventListener('keydown', ensureQbasicAudioUnlocked);
window.addEventListener('pointerdown', ensureQbasicAudioUnlocked, { passive: true });
