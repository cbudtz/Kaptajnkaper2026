import { formatString } from '../../i18n/index.js';
import { CgaMode } from '../constants/enums.js';

function adjustCharCode(i) {
  switch (i) {
    case 219:
      return 143;
    case 198:
      return 133;
    case 216:
      return 134;
    case 197:
      return 135;
    case 230:
      return 130;
    case 248:
      return 131;
    case 229:
      return 132;
    default:
      return i;
  }
}

export class CgaLabelFactory {
  /**
   * @param {import('phaser').Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    /** @type {Map<string, string>} */
    this.cache = new Map();
    this.mode = CgaMode.MODE1;
  }

  /** @param {import('../constants/enums.js').CgaMode} mode */
  setMode(mode) {
    this.mode = mode;
  }

  fontKey() {
    return this.mode === CgaMode.MODE2 ? 'font-mode2' : 'font-mode1';
  }

  /**
   * @param {string} text
   */
  textureForText(text) {
    const id = `cga-${this.mode}-${text}`;
    if (this.scene.textures.exists(id)) {
      return id;
    }

    const font = this.scene.textures.get(this.fontKey()).getSourceImage();
    const width = Math.max(16, text.length * 16);
    const canvas = this.scene.textures.createCanvas(id, width, 16);
    const ctx = canvas.getContext();

    let cursorx = 0;
    for (let i = 0; i < text.length; i += 1) {
      let chr = text.charCodeAt(i);
      chr = adjustCharCode(chr);
      chr -= 32;
      const x = chr % 16;
      const y = Math.floor(chr / 16);
      ctx.drawImage(font, x * 16, y * 16, 16, 16, cursorx * 16, 0, 16, 16);
      cursorx += 1;
    }

    canvas.refresh();
    return id;
  }

  getLabelTexture(resourceKey, replace0, replace1) {
    const text = formatString(resourceKey, replace0, replace1);
    return this.textureForText(text);
  }

  getRawTexture(text) {
    return this.textureForText(`${text}`);
  }
}
