export const KUBECONFIG_PROVIDER_TOKEN = Symbol.for('KubeConfigProvider');

export interface KubeConfig {
  readonly contexts: {
    readonly cluster: string;
    readonly user: string;
    readonly name: string;
    readonly namespace?: string;
  }[];
}

export interface KubeConfigProvider {
  getKubeConfig(): Promise<KubeConfig>;
}
