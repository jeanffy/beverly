import { V1Deployment, V1PodList } from '@kubernetes/client-node';
import { DeploymentDto } from '../../shared/dto.js';
import { InjectedDependencies } from '../core.js';
import { KUBECTL_PROVIDER_TOKEN, KubectlProvider } from '../providers/kubectl.provider.js';
import { UseCase } from '../use-case.js';

export const DEPLOYMENT_USE_CASE_TOKEN = Symbol.for('DeploymentUseCase');

export class DeploymentUseCase implements UseCase {
  private kubeCtl: KubectlProvider;

  public constructor(dependencies: InjectedDependencies) {
    this.kubeCtl = dependencies[KUBECTL_PROVIDER_TOKEN];
  }

  public async run(contextName: string, nsName: string, deploymentName: string): Promise<DeploymentDto> {
    const deployments = await this.kubeCtl.call<V1PodList>(
      `get deployment --field-selector metadata.name=${deploymentName}`,
      {
        contextName,
        nsName,
      },
    );
    return deployments.items[0] as V1Deployment;
  }
}
