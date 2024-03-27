import fs from 'node:fs/promises';
import jsYaml from 'js-yaml';
import { InjectedDependencies } from '../core.js';
import { CONFIG_PROVIDER_TOKEN, ConfigProvider } from '../providers/config.provider.js';
import { KubeConfig, KubeConfigProvider } from '../providers/kubeconfig.provider.js';

export class FsKubeConfig implements KubeConfigProvider {
  private configProvider: ConfigProvider;

  public constructor(dependencies: InjectedDependencies) {
    this.configProvider = dependencies[CONFIG_PROVIDER_TOKEN];
  }

  public async getKubeConfig(): Promise<KubeConfig> {
    const kubeConfigContent = await fs.readFile(this.configProvider.kubeconfigPath, { encoding: 'utf-8' });
    const kubeConfig = jsYaml.load(kubeConfigContent);
    return kubeConfig as KubeConfig;
  }
}
