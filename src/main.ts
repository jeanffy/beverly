// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata'; //! this import should appear before any other import that uses ioc
import { ZeppelinApp } from './app.js';
import getZeppelinIoc from './ioc.js';
import { LOG_PROVIDER_TOKEN, LogProvider } from './providers/log/log.provider.js';

const logProvider = getZeppelinIoc().getContainer().get<LogProvider>(LOG_PROVIDER_TOKEN);

const zeppelinApp = getZeppelinIoc().getContainer().get(ZeppelinApp);
zeppelinApp.initialize();
await zeppelinApp.start();

process.on('SIGINT', () => signalHandler('SIGINT'));
process.on('SIGTERM', () => signalHandler('SIGTERM'));

function signalHandler(signal: NodeJS.Signals): void {
  logProvider.info({ msg: `${signal} received, bye` });
  void zeppelinApp.stop();
  process.exit(0);
}

process.on('uncaughtException', (error: Error, origin: NodeJS.UncaughtExceptionOrigin): void => {
  logProvider.exception(error, { msg: 'uncaughtException', payload: origin });
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>): void => {
  logProvider.exception(reason, { msg: 'unhandledRejection', payload: promise });
});
