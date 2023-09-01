import { V1PodList, V1PodSpec } from '@kubernetes/client-node';
import { Renderer, Template } from '../base.renderer.js';
import { Breadcrumb } from '../breadcrumb.js';
import { Kubectl } from '../kubectl.js';
import { RenderCtx } from '../render.context.js';
import { injectObjectRawProps } from './utils.js';

export class PodRenderer extends Renderer {
  public constructor(ctx?: RenderCtx) {
    super(ctx);
  }

  public async render(podName: string): Promise<string> {
    const kubectl = new Kubectl(this.ctx);
    const pods = await kubectl.call<V1PodList>(`get pod --field-selector metadata.name=${podName}`);
    const pod = pods.items[0];
    const clusterArg = this.ctx?.clusterName !== undefined ? ` --cluster ${this.ctx.clusterName}` : '';
    const nsArg = this.ctx?.nsName !== undefined ? ` -n ${this.ctx.nsName}` : '';
    const terminalCmd = `kubectl exec -it ${podName}${clusterArg}${nsArg} -- sh`;
    const logsCmd = `kubectl logs -f ${podName}${clusterArg}${nsArg}`;
    const logsWithTailCmd = `kubectl logs --tail=100 -f ${podName}${clusterArg}${nsArg}`;
    if (pod !== undefined) {
      injectObjectRawProps(pod, ['metadata', 'spec', 'status']);
      injectObjectRawProps<V1PodSpec>(pod.spec!, ['containers', 'volumes']);
    }
    return this.renderTemplate(Template.Pod, {
      ...this.baseTemplateVars(),
      breadcrumb: new Breadcrumb(this.ctx).pod(podName),
      pod,
      terminalCmd,
      logsCmd,
      logsWithTailCmd,
    });
  }
}
