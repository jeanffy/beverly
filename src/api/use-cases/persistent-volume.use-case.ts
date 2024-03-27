import { V1PersistentVolumeList } from '@kubernetes/client-node';
import { PersistentVolumeDto } from '../../shared/dto.js';
import { InjectedDependencies } from '../core.js';
import { KUBECTL_PROVIDER_TOKEN, KubectlProvider } from '../providers/kubectl.provider.js';
import { UseCase } from '../use-case.js';

export const PV_USE_CASE_TOKEN = Symbol.for('PersistentVolumeUseCase');

export class PersistentVolumeUseCase implements UseCase {
  private kubeCtl: KubectlProvider;

  public constructor(dependencies: InjectedDependencies) {
    this.kubeCtl = dependencies[KUBECTL_PROVIDER_TOKEN];
  }

  public async run(contextName: string, pvName: string): Promise<PersistentVolumeDto> {
    const pvs = await this.kubeCtl.call<V1PersistentVolumeList>(`get pv --field-selector metadata.name=${pvName}`, {
      contextName,
    });
    const pv = pvs.items[0];
    if (pv === undefined) {
      throw new Error(`persistent volume '${pvName}' not found`);
    }
    return pv;
  }
}
