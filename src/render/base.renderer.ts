import twig from 'twig';
import { Routing } from '../routing.js';
import { RenderCtx } from './render.context.js';

export interface BaseTemplateVars {
  Routing: unknown; // TODO: type
  clusterName?: string;
  nsName?: string;
}

export enum Template {
  Context,
  Contexts,
  Deployment,
  Ingress,
  Namespace,
  Pod,
  PersistentVolume,
  PersistentVolumeClaim,
  Service,
}

export abstract class Renderer {
  public constructor(protected ctx?: RenderCtx) {}

  public abstract render(...params: unknown[]): Promise<string>;

  protected baseTemplateVars(): BaseTemplateVars {
    return {
      Routing,
      clusterName: this.ctx?.clusterName,
      nsName: this.ctx?.nsName,
    };
  }

  protected async renderTemplate(template: Template, options: twig.RenderOptions): Promise<string> {
    twig.cache(false);
    let templateName = 'base';
    switch (template) {
      case Template.Context: templateName = 'context'; break;
      case Template.Contexts: templateName = 'contexts'; break;
      case Template.Deployment: templateName = 'deployment'; break;
      case Template.Ingress: templateName = 'ingress'; break;
      case Template.Namespace: templateName = 'namespace'; break;
      case Template.Pod: templateName = 'pod'; break;
      case Template.PersistentVolume: templateName = 'pv'; break;
      case Template.PersistentVolumeClaim: templateName = 'pvc'; break;
      case Template.Service: templateName = 'service'; break;
    }
    return new Promise((resolve, reject) => {
      twig.renderFile(`src/views/${templateName}.twig`, options, (error: Error, html: string) => {
        if (error) {
          return reject(error);
        }
        return resolve(html);
      });
    });
  }
}
