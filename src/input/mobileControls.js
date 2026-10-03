/**
 * Wires on-screen buttons (touch devices) to the game host keyboard handler.
 * @param {(event: { key: string, preventDefault: () => void }) => void} handleKey
 */
export function bindMobileControls(handleKey) {
  const panel = document.getElementById('mobile-controls');
  if (!panel) return;

  const dispatch = (key) => {
    handleKey({
      key,
      preventDefault: () => {},
      stopPropagation: () => {},
    });
  };

  panel.querySelectorAll('button[data-key]').forEach((btn) => {
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-key');
      if (key) dispatch(key);
    });
  });

  // Tap on game area = "continue" on intro (space), without hitting buttons
  const gameContainer = document.getElementById('game-container');
  gameContainer?.addEventListener(
    'pointerdown',
    (e) => {
      if (e.target.closest('#mobile-controls')) return;
      dispatch(' ');
    },
    { passive: false },
  );
}
