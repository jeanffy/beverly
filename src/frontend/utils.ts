import { RouteLocationNormalizedLoaded } from 'vue-router';

export function scrollToRouteHashIfNecessary(route: RouteLocationNormalizedLoaded): void {
  setTimeout(() => {
    if (route.hash.length > 0 && route.hash.startsWith('#')) {
      const elements = document.getElementsByName(route.hash.slice(1));
      elements[0]?.scrollIntoView();
    }
  }, 1);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
