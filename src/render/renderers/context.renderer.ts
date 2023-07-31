import { V1NamespaceList } from '@kubernetes/client-node';
import { Renderer } from '../base.renderer.js';
import { Breadcrumb } from '../breadcrumb.js';
import { Kubectl } from '../kubectl.js';
import { RenderCtx } from '../render.context.js';

export class ContextRenderer extends Renderer {
  public constructor(ctx?: RenderCtx) {
    super(ctx);
  }

  public async render(clusterName: string): Promise<string> {
    const ctxOverride: RenderCtx = { clusterName: clusterName };
    const kubectl = new Kubectl(ctxOverride);
    const namespaces = await kubectl.call<V1NamespaceList>('get namespaces');
    const pvs = await kubectl.call<V1NamespaceList>('get pv');
    return this.twigRenderFilePromise('src/views/context.twig', {
      ...this.baseTemplateVars(),
      breadcrumb: new Breadcrumb(ctxOverride).context(clusterName),
      clusterName,
      namespaces: namespaces.items,
      pvs: pvs.items,
    });
  }
}
