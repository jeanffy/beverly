import { NextFunction, Response, Router } from 'express';
import getBeverlyIocContainer from './ioc.js';
import { UseCase } from './use-case.js';
import { CONTEXT_USE_CASE_TOKEN } from './use-cases/context.use-case.js';
import { CONTEXTS_USE_CASE_TOKEN } from './use-cases/contexts.use-case.js';
import { DEPLOYMENT_USE_CASE_TOKEN } from './use-cases/deployment.use-case.js';
import { INGRESS_USE_CASE_TOKEN } from './use-cases/ingress.use-case.js';
import { NAMESPACE_USE_CASE_TOKEN } from './use-cases/namespace.use-case.js';
import { PVC_USE_CASE_TOKEN } from './use-cases/persistent-volume-claim.use-case.js';
import { PV_USE_CASE_TOKEN } from './use-cases/persistent-volume.use-case.js';
import { POD_USE_CASE_TOKEN } from './use-cases/pod.use-case.js';
import { SERVICE_USE_CASE_TOKEN } from './use-cases/service.use-case.js';

async function callUseCase(token: symbol, parameters: unknown[], res: Response, next: NextFunction): Promise<void> {
  try {
    const useCase = getBeverlyIocContainer().resolve<UseCase>(token);
    const result = await useCase.run(...parameters);
    res.status(200).setHeader('Content-Type', 'application/json').send(result);
  } catch (error) {
    next(error);
  }
}

/* eslint-disable @typescript-eslint/no-misused-promises */

function routerApi(): Router {
  const router = Router();

  router
    .get('/contexts', async (_req, res, next): Promise<void> => callUseCase(CONTEXTS_USE_CASE_TOKEN, [], res, next))
    .get(
      '/contexts/:contextName',
      async (req, res, next): Promise<void> => callUseCase(CONTEXT_USE_CASE_TOKEN, [req.params.contextName], res, next),
    )
    .get(
      '/contexts/:contextName/namespaces/:nsName',
      async (req, res, next): Promise<void> =>
        callUseCase(NAMESPACE_USE_CASE_TOKEN, [req.params.contextName, req.params.nsName], res, next),
    )
    .get(
      '/contexts/:contextName/pvs/:pvName',
      async (req, res, next): Promise<void> =>
        callUseCase(PV_USE_CASE_TOKEN, [req.params.contextName, req.params.pvName], res, next),
    )
    .get(
      '/contexts/:contextName/namespaces/:nsName/deployments/:deploymentName',
      async (req, res, next): Promise<void> =>
        callUseCase(
          DEPLOYMENT_USE_CASE_TOKEN,
          [req.params.contextName, req.params.nsName, req.params.deploymentName],
          res,
          next,
        ),
    )
    .get(
      '/contexts/:contextName/namespaces/:nsName/pods/:podName',
      async (req, res, next): Promise<void> =>
        callUseCase(POD_USE_CASE_TOKEN, [req.params.contextName, req.params.nsName, req.params.podName], res, next),
    )
    .get(
      '/contexts/:contextName/namespaces/:nsName/services/:serviceName',
      async (req, res, next): Promise<void> =>
        callUseCase(
          SERVICE_USE_CASE_TOKEN,
          [req.params.contextName, req.params.nsName, req.params.serviceName],
          res,
          next,
        ),
    )
    .get(
      '/contexts/:contextName/namespaces/:nsName/ingresses/:ingressName',
      async (req, res, next): Promise<void> =>
        callUseCase(
          INGRESS_USE_CASE_TOKEN,
          [req.params.contextName, req.params.nsName, req.params.ingressName],
          res,
          next,
        ),
    )
    .get(
      '/contexts/:contextName/namespaces/:nsName/pvcs/:pvcName',
      async (req, res, next): Promise<void> =>
        callUseCase(PVC_USE_CASE_TOKEN, [req.params.contextName, req.params.nsName, req.params.pvcName], res, next),
    );

  return router;
}

/* eslint-enable @typescript-eslint/no-misused-promises */

export default routerApi;
