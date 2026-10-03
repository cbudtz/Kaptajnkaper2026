/**
 * @typedef {object} GameView
 * @property {(mode: import('../constants/enums.js').CgaMode) => void} setCgaMode
 * @property {(textureKey: string, x: number, y: number) => void} drawImage
 * @property {(textureKey: string, dx: number, dy: number, dw: number, dh: number, sx: number, sy: number, sw: number, sh: number) => void} drawImageCrop
 * @property {(resourceKey: string, x: number, y: number, replace0?: unknown, replace1?: unknown) => void} drawLabel
 * @property {(text: string, x: number, y: number) => void} drawLabelRaw
 */

export {};
