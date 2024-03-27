/// <reference types="vite/client" />
// eslint-disable-next-line import/no-unassigned-import
import 'vue-router';

interface ImportMetaEnv {}

export {};

export interface RouteBreadcrumb {
  text?: string;
  variableName?: string;
  static?: boolean;
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    breadcrumb?: RouteBreadcrumb;
  }
}
