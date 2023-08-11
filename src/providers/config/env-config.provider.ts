import path from 'node:path';
import { injectable } from 'inversify';
import { ConfigProvider } from './config.provider.js';

@injectable()
export class EnvConfigProvider implements ConfigProvider {
  public listenPort: number;
  public kubeconfigPath: string;

  public constructor() {
    const port = process.env.API_LISTEN_PORT;
    this.listenPort = port !== undefined ? Number(port) : 28142;
    if (process.env.KUBECONFIG_PATH !== undefined) {
      this.kubeconfigPath = process.env.KUBECONFIG_PATH;
    } else {
      this.kubeconfigPath = path.join(process.env.HOME ?? '', '.kube/config');
    }
  }
}
