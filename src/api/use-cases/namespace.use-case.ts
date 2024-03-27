import {
  V1DeploymentList,
  V1IngressList,
  V1PersistentVolumeClaimList,
  V1PodList,
  V1ServiceList,
} from '@kubernetes/client-node';
import { NamespaceDto } from '../../shared/dto.js';
import { InjectedDependencies } from '../core.js';
import { KUBECTL_PROVIDER_TOKEN, KubectlProvider } from '../providers/kubectl.provider.js';
import { UseCase } from '../use-case.js';

export const NAMESPACE_USE_CASE_TOKEN = Symbol.for('NamespaceUseCase');

export class NamespaceUseCase implements UseCase {
  private kubeCtl: KubectlProvider;

  public constructor(dependencies: InjectedDependencies) {
    this.kubeCtl = dependencies[KUBECTL_PROVIDER_TOKEN];
  }

  public async run(contextName: string, nsName: string): Promise<NamespaceDto> {
    const deployments = await this.kubeCtl.call<V1DeploymentList>('get deployments', { contextName, nsName });
    const pods = await this.kubeCtl.call<V1PodList>('get pods', { contextName, nsName });
    const services = await this.kubeCtl.call<V1ServiceList>('get services', { contextName, nsName });
    const ingresses = await this.kubeCtl.call<V1IngressList>('get ingresses', { contextName, nsName });
    const pvcs = await this.kubeCtl.call<V1PersistentVolumeClaimList>('get pvc', { contextName, nsName });
    return {
      name: nsName,
      contextName,
      deployments: deployments.items,
      pods: pods.items,
      services: services.items,
      ingresses: ingresses.items,
      pvcs: pvcs.items,
    };
  }
}
