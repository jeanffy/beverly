// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata'; //! this import should appear before any other import that uses ioc
import open from 'open';
import { BeverlyApp } from './app.js';
import getBeverlyIoc from './ioc.js';
import { CONFIG_PROVIDER_TOKEN, ConfigProvider } from './providers/config/config.provider.js';
import { LOG_PROVIDER_TOKEN, LogProvider } from './providers/log/log.provider.js';

const logProvider = getBeverlyIoc().getContainer().get<LogProvider>(LOG_PROVIDER_TOKEN);

const beverlyApp = getBeverlyIoc().getContainer().get(BeverlyApp);
beverlyApp.initialize();
await beverlyApp.start();

const configProvider = getBeverlyIoc().getContainer().get<ConfigProvider>(CONFIG_PROVIDER_TOKEN);
await open(`http://localhost:${configProvider.listenPort}`);

process.on('SIGINT', () => signalHandler('SIGINT'));
process.on('SIGTERM', () => signalHandler('SIGTERM'));

function signalHandler(signal: NodeJS.Signals): void {
  logProvider.info({ msg: `${signal} received, bye` });
  void beverlyApp.stop();
  process.exit(0);
}

process.on('uncaughtException', (error: Error, origin: NodeJS.UncaughtExceptionOrigin): void => {
  logProvider.exception(error, { msg: 'uncaughtException', payload: origin });
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>): void => {
  logProvider.exception(reason, { msg: 'unhandledRejection', payload: promise });
});
