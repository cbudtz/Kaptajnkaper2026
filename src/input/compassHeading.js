/** @typedef {'1'|'2'|'3'|'4'|'6'|'7'|'8'|'9'} MoveHeadingKey */

/** @param {string} key */
export function normalizeMoveHeadingKey(key) {
  switch (key) {
    case 'ArrowUp':
      return '8';
    case 'ArrowRight':
      return '6';
    case 'ArrowDown':
      return '2';
    case 'ArrowLeft':
      return '4';
    case '1':
    case '2':
    case '3':
    case '4':
    case '6':
    case '7':
    case '8':
    case '9':
      return key;
    default:
      return null;
  }
}

/** @param {MoveHeadingKey} key */
export function headingKeyToDegrees(key) {
  const map = {
    '8': 0,
    '9': 45,
    '6': 90,
    '3': 135,
    '2': 180,
    '1': 225,
    '4': 270,
    '7': 315,
  };
  return map[key] ?? null;
}

/**
 * @param {ParentNode | null | undefined} deckRoot
 * @param {string | null | undefined} headingKey
 */
export function updateCompassRoseHeading(deckRoot, headingKey) {
  const compass = deckRoot?.querySelector?.('.mobile-dpad-compass');
  if (!compass) return;

  const normalized = headingKey ? normalizeMoveHeadingKey(headingKey) : null;
  const deg = normalized ? headingKeyToDegrees(normalized) : null;

  if (deg === null) {
    compass.classList.remove('has-heading');
    compass.style.removeProperty('--compass-heading-deg');
    return;
  }

  compass.classList.add('has-heading');
  compass.style.setProperty('--compass-heading-deg', `${deg}deg`);
}
