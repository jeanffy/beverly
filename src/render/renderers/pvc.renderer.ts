import { V1IngressList } from '@kubernetes/client-node';
import { Renderer, Template } from '../base.renderer.js';
import { Breadcrumb } from '../breadcrumb.js';
import { Kubectl } from '../kubectl.js';
import { RenderCtx } from '../render.context.js';
import { injectObjectRawProps } from './utils.js';

export class PVCRenderer extends Renderer {
  public constructor(ctx?: RenderCtx) {
    super(ctx);
  }

  public async render(pvcName: string): Promise<string> {
    const kubectl = new Kubectl(this.ctx);
    const pvcs = await kubectl.call<V1IngressList>(`get pvc --field-selector metadata.name=${pvcName}`);
    const pvc = pvcs.items[0];
    if (pvc !== undefined) {
      injectObjectRawProps(pvc, ['metadata', 'spec', 'status']);
    }
    return this.renderTemplate(Template.PersistentVolumeClaim, {
      ...this.baseTemplateVars(),
      breadcrumb: new Breadcrumb(this.ctx).persistentVolumeClaim(pvcName),
      pvc,
    });
  }
}
