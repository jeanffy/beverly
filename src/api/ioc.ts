import { asClass, AwilixContainer, createContainer } from 'awilix';
import { BERVERLY_APP_TOKEN, BeverlyApp } from './app.js';
import { ConsoleLogProvider } from './drivers/console-log.provider.js';
import { EnvConfigProvider } from './drivers/env-config.provider.js';
import { FsKubeConfig } from './drivers/fs-kubeconfig.provider.js';
import { ShellKubeCtl } from './drivers/shell-kubectl.provider.js';
import { CONFIG_PROVIDER_TOKEN } from './providers/config.provider.js';
import { KUBECONFIG_PROVIDER_TOKEN } from './providers/kubeconfig.provider.js';
import { KUBECTL_PROVIDER_TOKEN } from './providers/kubectl.provider.js';
import { LOG_PROVIDER_TOKEN } from './providers/log.provider.js';
import { CONTEXT_USE_CASE_TOKEN, ContextUseCase } from './use-cases/context.use-case.js';
import { CONTEXTS_USE_CASE_TOKEN, ContextsUseCase } from './use-cases/contexts.use-case.js';
import { DEPLOYMENT_USE_CASE_TOKEN, DeploymentUseCase } from './use-cases/deployment.use-case.js';
import { INGRESS_USE_CASE_TOKEN, IngressUseCase } from './use-cases/ingress.use-case.js';
import { NAMESPACE_USE_CASE_TOKEN, NamespaceUseCase } from './use-cases/namespace.use-case.js';
import { PersistentVolumeClaimUseCase, PVC_USE_CASE_TOKEN } from './use-cases/persistent-volume-claim.use-case.js';
import { PersistentVolumeUseCase, PV_USE_CASE_TOKEN } from './use-cases/persistent-volume.use-case.js';
import { POD_USE_CASE_TOKEN, PodUseCase } from './use-cases/pod.use-case.js';
import { SERVICE_USE_CASE_TOKEN, ServiceUseCase } from './use-cases/service.use-case.js';

let beverlyIocContainer: AwilixContainer | undefined;

export default function getBeverlyIocContainer(): AwilixContainer {
  if (beverlyIocContainer === undefined) {
    beverlyIocContainer = createContainer();
    beverlyIocContainer.register({
      [CONFIG_PROVIDER_TOKEN]: asClass(EnvConfigProvider).singleton(),
      [KUBECONFIG_PROVIDER_TOKEN]: asClass(FsKubeConfig).singleton(),
      [KUBECTL_PROVIDER_TOKEN]: asClass(ShellKubeCtl).singleton(),
      [LOG_PROVIDER_TOKEN]: asClass(ConsoleLogProvider).singleton(),

      [CONTEXT_USE_CASE_TOKEN]: asClass(ContextUseCase).singleton(),
      [CONTEXTS_USE_CASE_TOKEN]: asClass(ContextsUseCase).singleton(),
      [DEPLOYMENT_USE_CASE_TOKEN]: asClass(DeploymentUseCase).singleton(),
      [INGRESS_USE_CASE_TOKEN]: asClass(IngressUseCase).singleton(),
      [NAMESPACE_USE_CASE_TOKEN]: asClass(NamespaceUseCase).singleton(),
      [PVC_USE_CASE_TOKEN]: asClass(PersistentVolumeClaimUseCase).singleton(),
      [PV_USE_CASE_TOKEN]: asClass(PersistentVolumeUseCase).singleton(),
      [POD_USE_CASE_TOKEN]: asClass(PodUseCase).singleton(),
      [SERVICE_USE_CASE_TOKEN]: asClass(ServiceUseCase).singleton(),

      [BERVERLY_APP_TOKEN]: asClass(BeverlyApp).singleton(),
    });
  }
  return beverlyIocContainer;
}
