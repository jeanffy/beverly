import http from 'node:http';
import express, { Express, NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { CONFIG_PROVIDER_TOKEN, ConfigProvider } from './providers/config/config.provider.js';
import { LOG_PROVIDER_TOKEN, LogProvider } from './providers/log/log.provider.js';
import { ContextRenderer } from './render/renderers/context.renderer.js';
import { ContextsRenderer } from './render/renderers/contexts.renderer.js';
import { DeploymentRenderer } from './render/renderers/deployment.renderer.js';
import { IngressRenderer } from './render/renderers/ingress.renderer.js';
import { NamespaceRenderer } from './render/renderers/namespace.renderer.js';
import { PodRenderer } from './render/renderers/pod.renderer.js';
import { PVRenderer } from './render/renderers/pv.renderer.js';
import { PVCRenderer } from './render/renderers/pvc.renderer.js';
import { ServiceRenderer } from './render/renderers/service.renderer.js';
import {
  ContextParams,
  DeploymentParams,
  IngressParams,
  NamespaceParams,
  PersistentVolumeClaimParams,
  PersistentVolumeParams,
  PodParams,
  Routing,
  ServiceParams,
} from './routing.js';

@injectable()
export class BeverlyApp {
  public app: Express;
  private httpServer: http.Server | undefined;

  public constructor(
    @inject(LOG_PROVIDER_TOKEN) private logProvider: LogProvider,
    @inject(CONFIG_PROVIDER_TOKEN) private configProvider: ConfigProvider,
  ) {
    this.app = express();
  }

  public initialize(): void {
    this.app.use(express.text()).use('/assets', express.static('src/assets'));
    this.initializeRoutes(this.app);
    this.app
      .use((_req: Request, res: Response): void => {
        res.redirect(Routing.contexts());
      })
      .use((error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
        res.status(500).setHeader('Content-Type', 'text/plain').send(error);
      });
  }

  /* istanbul ignore next */
  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpServer = this.app.listen(this.configProvider.listenPort);
      this.httpServer.on('error', error => {
        this.logProvider.exception(error, { msg: 'start error' });
        reject(error);
      });
      this.httpServer.on('listening', () => {
        this.logProvider.info({ msg: `listening port ${this.configProvider.listenPort}` });
        resolve();
      });
    });
  }

  /* istanbul ignore next */
  public stop(): Promise<void> {
    if (this.httpServer !== undefined) {
      this.httpServer.close();
    }
    return Promise.resolve();
  }

  private initializeRoutes(app: Express): void {
    app
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      .get(Routing.contexts(), async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        await this.render(res, next, new ContextsRenderer().render());
      })
      .get(
        Routing.context(':cluster'),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (req: Request<ContextParams>, res: Response, next: NextFunction): Promise<void> => {
          await this.render(res, next, new ContextRenderer().render(req.params.cluster));
        },
      )
      .get(
        Routing.persistentVolume(':cluster', ':pv'),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (req: Request<PersistentVolumeParams>, res: Response, next: NextFunction): Promise<void> => {
          await this.render(res, next, new PVRenderer({ clusterName: req.params.cluster }).render(req.params.pv));
        },
      )
      .get(
        Routing.namespace(':cluster', ':ns'),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (req: Request<NamespaceParams>, res: Response, next: NextFunction): Promise<void> => {
          await this.render(
            res,
            next,
            new NamespaceRenderer({ clusterName: req.params.cluster }).render(req.params.ns),
          );
        },
      )
      .get(
        Routing.deployment(':cluster', ':ns', ':deployment'),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (req: Request<DeploymentParams>, res: Response, next: NextFunction): Promise<void> => {
          await this.render(
            res,
            next,
            new DeploymentRenderer({ clusterName: req.params.cluster, nsName: req.params.ns }).render(
              req.params.deployment,
            ),
          );
        },
      )
      .get(
        Routing.pod(':cluster', ':ns', ':pod'),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (req: Request<PodParams>, res: Response, next: NextFunction): Promise<void> => {
          await this.render(
            res,
            next,
            new PodRenderer({ clusterName: req.params.cluster, nsName: req.params.ns }).render(req.params.pod),
          );
        },
      )
      .get(
        Routing.service(':cluster', ':ns', ':service'),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (req: Request<ServiceParams>, res: Response, next: NextFunction): Promise<void> => {
          await this.render(
            res,
            next,
            new ServiceRenderer({ clusterName: req.params.cluster, nsName: req.params.ns }).render(req.params.service),
          );
        },
      )
      .get(
        Routing.ingress(':cluster', ':ns', ':ingress'),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (req: Request<IngressParams>, res: Response, next: NextFunction): Promise<void> => {
          await this.render(
            res,
            next,
            new IngressRenderer({ clusterName: req.params.cluster, nsName: req.params.ns }).render(req.params.ingress),
          );
        },
      )
      .get(
        Routing.persistentVolumeClaim(':cluster', ':ns', ':pvc'),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (req: Request<PersistentVolumeClaimParams>, res: Response, next: NextFunction): Promise<void> => {
          await this.render(
            res,
            next,
            new PVCRenderer({ clusterName: req.params.cluster, nsName: req.params.ns }).render(req.params.pvc),
          );
        },
      );
  }

  private async render(res: Response, next: NextFunction, renderPromise: Promise<string>): Promise<void> {
    try {
      const html = await renderPromise;
      res.status(200).setHeader('Content-Type', 'text/html').send(html);
    } catch (error) {
      this.logProvider.exception(error, { msg: 'render' });
      next(error);
    }
  }
}
