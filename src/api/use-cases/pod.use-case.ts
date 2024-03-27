import { V1ContainerPort, V1PodList } from '@kubernetes/client-node';
import { PodDto } from '../../shared/dto.js';
import { InjectedDependencies } from '../core.js';
import { KUBECTL_PROVIDER_TOKEN, KubectlProvider } from '../providers/kubectl.provider.js';
import { UseCase } from '../use-case.js';

export const POD_USE_CASE_TOKEN = Symbol.for('PodUseCase');

export class PodUseCase implements UseCase {
  private kubeCtl: KubectlProvider;

  public constructor(dependencies: InjectedDependencies) {
    this.kubeCtl = dependencies[KUBECTL_PROVIDER_TOKEN];
  }

  public async run(contextName: string, nsName: string, podName: string): Promise<PodDto> {
    const pods = await this.kubeCtl.call<V1PodList>(`get pod --field-selector metadata.name=${podName}`, {
      contextName,
      nsName,
    });
    const pod = pods.items[0];
    if (pod === undefined) {
      throw new Error(`pod '${podName}' not found`);
    }

    const terminalCmd = `kubectl exec -it ${podName} --cluster ${contextName} -n ${nsName} -- sh`;
    const logsCmd = `kubectl logs -f ${podName} --cluster ${contextName} -n ${nsName}`;
    const logsWithTailCmd = `kubectl logs --tail=100 -f ${podName} --cluster ${contextName} -n ${nsName}`;

    let portForwardCmd: string | undefined;
    const podContainers = pod?.spec?.containers;
    if (podContainers !== undefined && podContainers.length > 0) {
      const podPorts = podContainers[0]?.ports;
      if (podPorts !== undefined && podPorts.length > 0) {
        const containerPort = (podPorts[0] as V1ContainerPort).containerPort;
        portForwardCmd = `kubectl port-forward ${podName} --cluster ${contextName} -n ${nsName} :${containerPort}`;
      }
    }

    return {
      ...pod,
      cmd: {
        terminal: terminalCmd,
        logs: logsCmd,
        logsWithTail: logsWithTailCmd,
        portForward: portForwardCmd,
      },
    };
  }
}
