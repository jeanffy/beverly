import { V1PodList } from '@kubernetes/client-node';
import { Renderer, Template } from '../base.renderer.js';
import { Breadcrumb } from '../breadcrumb.js';
import { Kubectl } from '../kubectl.js';
import { RenderCtx } from '../render.context.js';
import { injectObjectRawProps } from './utils.js';

export class DeploymentRenderer extends Renderer {
  public constructor(ctx?: RenderCtx) {
    super(ctx);
  }

  public async render(deploymentName: string): Promise<string> {
    const kubectl = new Kubectl(this.ctx);
    const deployments = await kubectl.call<V1PodList>(
      `get deployment --field-selector metadata.name=${deploymentName}`,
    );
    const deployment = deployments.items[0];
    if (deployment !== undefined) {
      injectObjectRawProps(deployment, ['metadata', 'spec', 'status']);
    }
    return this.renderTemplate(Template.Deployment, {
      ...this.baseTemplateVars(),
      breadcrumb: new Breadcrumb(this.ctx).deployment(deploymentName),
      deployment,
    });
  }
}
