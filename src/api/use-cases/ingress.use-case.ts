import { V1IngressList } from '@kubernetes/client-node';
import { IngressDto } from '../../shared/dto.js';
import { InjectedDependencies } from '../core.js';
import { KUBECTL_PROVIDER_TOKEN, KubectlProvider } from '../providers/kubectl.provider.js';
import { UseCase } from '../use-case.js';

export const INGRESS_USE_CASE_TOKEN = Symbol.for('IngressUseCase');

export class IngressUseCase implements UseCase {
  private kubeCtl: KubectlProvider;

  public constructor(dependencies: InjectedDependencies) {
    this.kubeCtl = dependencies[KUBECTL_PROVIDER_TOKEN];
  }

  public async run(contextName: string, nsName: string, ingressName: string): Promise<IngressDto> {
    const ingresses = await this.kubeCtl.call<V1IngressList>(
      `get ingress --field-selector metadata.name=${ingressName}`,
      { contextName, nsName },
    );
    const ingress = ingresses.items[0];
    if (ingress === undefined) {
      throw new Error(`ingress '${ingressName}' not found`);
    }
    return ingress;
  }
}
