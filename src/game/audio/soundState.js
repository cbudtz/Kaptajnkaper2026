/** Mirrors DOS LYD flag in KAPER.BAS. */
let gameSoundEnabled = true;

export function setGameSoundEnabled(enabled) {
  gameSoundEnabled = !!enabled;
}

export function toggleGameSound() {
  gameSoundEnabled = !gameSoundEnabled;
  return gameSoundEnabled;
}

export function isGameSoundEnabled() {
  return gameSoundEnabled;
}
