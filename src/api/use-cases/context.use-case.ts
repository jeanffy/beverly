import { V1NamespaceList, V1PersistentVolumeList } from '@kubernetes/client-node';
import { ContextDto } from '../../shared/dto.js';
import { InjectedDependencies } from '../core.js';
import { KUBECTL_PROVIDER_TOKEN, KubectlProvider } from '../providers/kubectl.provider.js';
import { UseCase } from '../use-case.js';

export const CONTEXT_USE_CASE_TOKEN = Symbol.for('ContextUseCase');

export class ContextUseCase implements UseCase {
  private kubeCtl: KubectlProvider;

  public constructor(dependencies: InjectedDependencies) {
    this.kubeCtl = dependencies[KUBECTL_PROVIDER_TOKEN];
  }

  public async run(contextName: string): Promise<ContextDto> {
    const namespaces = await this.kubeCtl.call<V1NamespaceList>('get namespaces', { contextName: contextName });
    const pvs = await this.kubeCtl.call<V1PersistentVolumeList>('get pv', { contextName: contextName });
    return {
      name: contextName,
      namespaces: namespaces.items,
      pvs: pvs.items,
    };
  }
}
