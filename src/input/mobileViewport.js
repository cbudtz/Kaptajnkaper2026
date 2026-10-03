const VIEWPORT_CONTENT =
  'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover';

/** Reset pinch/zoom after input focus (common on Android Chrome). */
export function resetMobileViewportZoom() {
  const meta = document.querySelector('meta[name="viewport"]');
  if (meta) meta.setAttribute('content', VIEWPORT_CONTENT);
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function bindMobileViewportHandlers() {
  const nameInput = document.getElementById('mobile-name-input');
  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      setTimeout(resetMobileViewportZoom, 100);
    });
  }

  window.visualViewport?.addEventListener('resize', () => {
    const active = document.activeElement;
    if (active?.id === 'mobile-name-input') return;
    setTimeout(resetMobileViewportZoom, 50);
  });
}
