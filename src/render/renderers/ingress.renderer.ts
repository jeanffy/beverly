import { V1IngressList } from '@kubernetes/client-node';
import { Renderer } from '../base.renderer.js';
import { Breadcrumb } from '../breadcrumb.js';
import { Kubectl } from '../kubectl.js';
import { RenderCtx } from '../render.context.js';
import { injectObjectRawProps } from './utils.js';

export class IngressRenderer extends Renderer {
  public constructor(ctx?: RenderCtx) {
    super(ctx);
  }

  public async render(ingressName: string): Promise<string> {
    const kubectl = new Kubectl(this.ctx);
    const ingresses = await kubectl.call<V1IngressList>(`get ingress --field-selector metadata.name=${ingressName}`);
    const ingress = ingresses.items[0];
    if (ingress !== undefined) {
      injectObjectRawProps(ingress, ['metadata', 'spec', 'status']);
    }
    return this.twigRenderFilePromise('src/views/ingress.twig', {
      ...this.baseTemplateVars(),
      breadcrumb: new Breadcrumb(this.ctx).ingress(ingressName),
      ingress,
    });
  }
}
