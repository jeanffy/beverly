import { V1PersistentVolumeClaimList } from '@kubernetes/client-node';
import { PersistentVolumeClaimDto } from '../../shared/dto.js';
import { InjectedDependencies } from '../core.js';
import { KUBECTL_PROVIDER_TOKEN, KubectlProvider } from '../providers/kubectl.provider.js';
import { UseCase } from '../use-case.js';

export const PVC_USE_CASE_TOKEN = Symbol.for('PersistentVolumeClaimUseCase');

export class PersistentVolumeClaimUseCase implements UseCase {
  private kubeCtl: KubectlProvider;

  public constructor(dependencies: InjectedDependencies) {
    this.kubeCtl = dependencies[KUBECTL_PROVIDER_TOKEN];
  }

  public async run(contextName: string, nsName: string, pvcName: string): Promise<PersistentVolumeClaimDto> {
    const pvcs = await this.kubeCtl.call<V1PersistentVolumeClaimList>(
      `get pvc --field-selector metadata.name=${pvcName}`,
      { contextName, nsName },
    );
    const pvc = pvcs.items[0];
    if (pvc === undefined) {
      throw new Error(`persistent volume claim '${pvcName}' not found`);
    }
    return pvc;
  }
}
