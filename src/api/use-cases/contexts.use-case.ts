import { ContextInfoDto } from '../../shared/dto.js';
import { InjectedDependencies } from '../core.js';
import { KUBECONFIG_PROVIDER_TOKEN, KubeConfigProvider } from '../providers/kubeconfig.provider.js';
import { UseCase } from '../use-case.js';

export const CONTEXTS_USE_CASE_TOKEN = Symbol.for('ContextsUseCase');

export class ContextsUseCase implements UseCase {
  private kubeConfig: KubeConfigProvider;

  public constructor(dependencies: InjectedDependencies) {
    this.kubeConfig = dependencies[KUBECONFIG_PROVIDER_TOKEN];
  }

  public async run(): Promise<ContextInfoDto[]> {
    const kubeConfig = await this.kubeConfig.getKubeConfig();
    return kubeConfig.contexts.map(c => ({
      name: c.name,
    }));
  }
}
