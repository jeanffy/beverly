export const CONFIG_PROVIDER_TOKEN = Symbol.for('ConfigProvider');

export interface ConfigProvider {
  readonly listenPort: number;
  readonly kubeconfigPath: string;
}
