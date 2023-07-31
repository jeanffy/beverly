import { V1DeploymentList, V1IngressList, V1PodList, V1ServiceList } from '@kubernetes/client-node';
import { Renderer } from '../base.renderer.js';
import { Breadcrumb } from '../breadcrumb.js';
import { Kubectl } from '../kubectl.js';
import { RenderCtx } from '../render.context.js';

export class NamespaceRenderer extends Renderer {
  public constructor(ctx?: RenderCtx) {
    super(ctx);
  }

  public async render(nsName: string): Promise<string> {
    const ctxOverride: RenderCtx = { ...this.ctx, nsName: nsName };
    const kubectl = new Kubectl(ctxOverride);
    const deployments = await kubectl.call<V1DeploymentList>('get deployments');
    const pods = await kubectl.call<V1PodList>('get pods');
    const services = await kubectl.call<V1ServiceList>('get services');
    const ingresses = await kubectl.call<V1IngressList>('get ingresses');
    const pvcs = await kubectl.call<V1IngressList>('get pvc');
    return this.twigRenderFilePromise('src/views/namespace.twig', {
      ...this.baseTemplateVars(),
      breadcrumb: new Breadcrumb(ctxOverride).namespace(nsName),
      nsName,
      deployments: deployments.items,
      pods: pods.items,
      services: services.items,
      ingresses: ingresses.items,
      pvcs: pvcs.items,
    });
  }
}
