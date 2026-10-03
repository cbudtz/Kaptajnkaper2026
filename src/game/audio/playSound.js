const qbasicPlayStrings = {
  intro: 'T230L8MBMSCO3BO4C4O3CP8C4GFEGO4CP8CEDCD4O3D4D4O4D CO3BDGDG4ABO4C32D32C16O3BAGA32B32A16GFEF32G32F16EDCDCO2BAGO3CO2BO3DCEDFE16F16EC4C4',
  taps: 'T180MBO2L4G.G8O3C1P4O2G.O3C8E1P4O2G.O3C8E2O2G.O3C8E2O2G.O3C8E1P2C.O3E8G1.O2G.G8O3C1',
  flute1: 'MBT200L16O3CEGO4C..O3GO4C4',
  b5th: 'MBT200O2L8GGGE-2.P8FFFD2.',
  beep: 'T255O4L64C',
  flee: 'T255O5L32GFEDCBO4AGFEDC',
};

/** @type {import('../../legacy/qbasicplayer.js').PlayStringPlayer | null} */
let qbasicPlayer = null;

function getPlayer() {
  if (!qbasicPlayer && typeof PlayStringPlayer !== 'undefined') {
    qbasicPlayer = new PlayStringPlayer();
  }
  return qbasicPlayer;
}

export function playSound(name) {
  if (typeof isGameSoundEnabled === 'function' && !isGameSoundEnabled()) {
    return;
  }

  const playString = qbasicPlayStrings[name];
  if (!playString) {
    return;
  }

  const player = getPlayer();
  if (!player) {
    return;
  }

  player.ensureAudio().then(() => {
    player.play(playString);
  }).catch(() => {});
}
