export const NAVIGATE_EVENT = 'pw:navigate';

/** SPA navigation: pushState, jump to top without animation, and tell App to re-read the URL. */
export function navigate(path: string): void {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}
