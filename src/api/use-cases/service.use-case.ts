import { V1ServiceList } from '@kubernetes/client-node';
import { ServiceDto } from '../../shared/dto.js';
import { InjectedDependencies } from '../core.js';
import { KUBECTL_PROVIDER_TOKEN, KubectlProvider } from '../providers/kubectl.provider.js';
import { UseCase } from '../use-case.js';

export const SERVICE_USE_CASE_TOKEN = Symbol.for('ServiceUseCase');

export class ServiceUseCase implements UseCase {
  private kubeCtl: KubectlProvider;

  public constructor(dependencies: InjectedDependencies) {
    this.kubeCtl = dependencies[KUBECTL_PROVIDER_TOKEN];
  }

  public async run(contextName: string, nsName: string, serviceName: string): Promise<ServiceDto> {
    const services = await this.kubeCtl.call<V1ServiceList>(
      `get service --field-selector metadata.name=${serviceName}`,
      { contextName, nsName },
    );
    const service = services.items[0];
    if (service === undefined) {
      throw new Error(`service '${serviceName}' not found`);
    }
    return service;
  }
}
