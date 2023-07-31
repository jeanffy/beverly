import twig from 'twig';
import { Routing } from '../routing.js';
import { RenderCtx } from './render.context.js';

export interface BaseTemplateVars {
  Routing: unknown; // TODO: type
  clusterName?: string;
  nsName?: string;
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

  protected async twigRenderFilePromise(templatePath: string, options: twig.RenderOptions): Promise<string> {
    twig.cache(false);
    return new Promise((resolve, reject) => {
      twig.renderFile(templatePath, options, (error: Error, html: string) => {
        if (error) {
          return reject(error);
        }
        return resolve(html);
      });
    });
  }
}
