import { defineStore } from 'pinia';
import { ref } from 'vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import { RouteBreadcrumb } from '../env.js';

export interface BreadcrumbItem {
  text: string;
  url?: string;
}

export const useBreadcrumb = defineStore('breadcrumb', () => {
  const items = ref<BreadcrumbItem[]>([]);

  function populate<T>(route: RouteLocationNormalizedLoaded, variableValues: T): void {
    items.value = [];

    const routeFragments = route.matched.filter(m => m.meta.breadcrumb !== undefined);
    for (const routeFragment of routeFragments) {
      const breadcrumb = routeFragment.meta.breadcrumb as RouteBreadcrumb;

      let text = '';
      if (breadcrumb.text !== undefined) {
        text = breadcrumb.text;
      } else if (
        breadcrumb.variableName !== undefined &&
        Object.prototype.hasOwnProperty.call(variableValues, breadcrumb.variableName)
      ) {
        text = variableValues[breadcrumb.variableName as keyof T] as string;
      }

      let url: string | undefined;
      if (breadcrumb.static !== true) {
        url = routeFragment.path;
        for (const [paramName, paramValue] of Object.entries(route.params)) {
          url = url.replaceAll(`:${paramName}`, paramValue as string);
        }
      }

      items.value.push({ text, url });
    }
  }

  return { items, populate };
});
