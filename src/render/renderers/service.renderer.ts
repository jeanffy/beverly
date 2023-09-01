import { V1ServiceList } from '@kubernetes/client-node';
import { Renderer, Template } from '../base.renderer.js';
import { Breadcrumb } from '../breadcrumb.js';
import { Kubectl } from '../kubectl.js';
import { RenderCtx } from '../render.context.js';
import { injectObjectRawProps } from './utils.js';

export class ServiceRenderer extends Renderer {
  public constructor(ctx?: RenderCtx) {
    super(ctx);
  }

  public async render(serviceName: string): Promise<string> {
    const kubectl = new Kubectl(this.ctx);
    const services = await kubectl.call<V1ServiceList>(`get service --field-selector metadata.name=${serviceName}`);
    const service = services.items[0];
    if (service !== undefined) {
      injectObjectRawProps(service, ['metadata', 'spec', 'status']);
    }
    return this.renderTemplate(Template.Service, {
      ...this.baseTemplateVars(),
      breadcrumb: new Breadcrumb(this.ctx).service(serviceName),
      service,
    });
  }
}
