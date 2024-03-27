import http from 'node:http';
import express, { Express, NextFunction, Request, Response } from 'express';
import { InjectedDependencies } from './core.js';
import { CONFIG_PROVIDER_TOKEN, ConfigProvider } from './providers/config.provider.js';
import { LOG_PROVIDER_TOKEN, LogProvider } from './providers/log.provider.js';
import routerApi from './router-api.js';
import routerFrontend from './router-frontend.js';

export const BERVERLY_APP_TOKEN = Symbol.for('BeverlyApp');

export class BeverlyApp {
  private logProvider: LogProvider;
  private configProvider: ConfigProvider;
  public app: Express;
  private httpServer: http.Server | undefined;

  public constructor(dependencies: InjectedDependencies) {
    this.logProvider = dependencies[LOG_PROVIDER_TOKEN];
    this.configProvider = dependencies[CONFIG_PROVIDER_TOKEN];
    this.app = express();
  }

  private initialize(): void {
    this.app.use('*', (req: Request, res: Response, next: NextFunction): void => {
      const startTime = new Date().getTime();
      this.logProvider.info({ msg: `--> ${req.method} ${req.originalUrl}` });
      res.once('finish', () => {
        const duration = new Date().getTime() - startTime;
        this.logProvider.info({
          msg: `<-- ${req.method} ${req.originalUrl}`,
          payload: { status: res.statusCode, duration: duration },
        });
      });
      next();
    });

    this.app.use('/api', routerApi());
    this.app.use('', routerFrontend(this.configProvider));

    this.app.use((_req: Request, res: Response): void => {
      res.status(404).setHeader('Content-Type', 'text/plain').send('nothing here');
    });

    this.app.use((error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
      this.logProvider.exception(error, { msg: 'error' });
      res.status(500).setHeader('Content-Type', 'text/plain').send('error');
    });
  }

  public start(): Promise<void> {
    this.initialize();
    return new Promise((resolve, reject) => {
      // this server is not meant to be accessible externally
      this.httpServer = this.app.listen(this.configProvider.listenPort, '127.0.0.1');
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

  public stop(): Promise<void> {
    if (this.httpServer !== undefined) {
      this.httpServer.close();
    }
    return Promise.resolve();
  }
}
