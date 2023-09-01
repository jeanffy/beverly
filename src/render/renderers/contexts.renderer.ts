import { Renderer, Template } from '../base.renderer.js';
import { Breadcrumb } from '../breadcrumb.js';
import { getKubeConfig } from '../kubeconfig.js';
import { RenderCtx } from '../render.context.js';

export class ContextsRenderer extends Renderer {
  public constructor(ctx?: RenderCtx) {
    super(ctx);
  }

  public async render(): Promise<string> {
    const kubeConfig = await getKubeConfig();
    return this.renderTemplate(Template.Contexts, {
      ...this.baseTemplateVars(),
      breadcrumb: new Breadcrumb(this.ctx).contexts(),
      contexts: kubeConfig.contexts,
    });
  }
}
