import childProcess from 'node:child_process';
import util from 'node:util';
import { InjectedDependencies } from '../core.js';
import { CONFIG_PROVIDER_TOKEN, ConfigProvider } from '../providers/config.provider.js';
import { KubectlContext, KubectlProvider } from '../providers/kubectl.provider.js';
import { LOG_PROVIDER_TOKEN, LogProvider } from '../providers/log.provider.js';

export class ShellKubeCtl implements KubectlProvider {
  private configProvider: ConfigProvider;
  private logProvider: LogProvider;

  public context?: {
    clusterName?: string;
    nsName?: string;
  };

  public constructor(dependencies: InjectedDependencies) {
    this.configProvider = dependencies[CONFIG_PROVIDER_TOKEN];
    this.logProvider = dependencies[LOG_PROVIDER_TOKEN];
  }

  public async call<T>(cmd: string, contextOverride?: KubectlContext): Promise<T> {
    const cmdArgs = cmd.split(' ');

    cmdArgs.push('-o', 'json');

    cmdArgs.push('--kubeconfig', this.configProvider.kubeconfigPath);

    const effectiveContextName = contextOverride?.contextName ?? this.context?.clusterName;
    if (effectiveContextName !== undefined) {
      cmdArgs.push('--context', effectiveContextName);
    }

    const effectiveNsName = contextOverride?.nsName ?? this.context?.nsName;
    if (effectiveNsName !== undefined) {
      cmdArgs.push('-n', effectiveNsName);
    }

    const command = `kubectl ${cmdArgs.join(' ')}`;

    if (process.env.DEBUG_CMD === '1') {
      this.logProvider.debug({ msg: command });
    }

    const promiseExec = util.promisify(childProcess.exec);
    const { stdout } = await promiseExec(command);

    return JSON.parse(stdout);
  }
}
