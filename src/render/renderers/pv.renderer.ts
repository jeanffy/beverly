import { V1DeploymentList } from '@kubernetes/client-node';
import { Renderer } from '../base.renderer.js';
import { Breadcrumb } from '../breadcrumb.js';
import { Kubectl } from '../kubectl.js';
import { RenderCtx } from '../render.context.js';
import { injectObjectRawProps } from './utils.js';

export class PVRenderer extends Renderer {
  public constructor(ctx?: RenderCtx) {
    super(ctx);
  }

  public async render(pvName: string): Promise<string> {
    const kubectl = new Kubectl(this.ctx);
    const pvs = await kubectl.call<V1DeploymentList>(`get pv --field-selector metadata.name=${pvName}`);
    const pv = pvs.items[0];
    if (pv !== undefined) {
      injectObjectRawProps(pv, ['metadata', 'spec', 'status']);
    }
    return this.twigRenderFilePromise('src/views/pv.twig', {
      ...this.baseTemplateVars(),
      breadcrumb: new Breadcrumb(this.ctx).persistentVolume(pvName),
      pv,
    });
  }
}
