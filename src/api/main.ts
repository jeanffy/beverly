import open from 'open';
import { BERVERLY_APP_TOKEN, BeverlyApp } from './app.js';
import getBeverlyIocContainer from './ioc.js';
import { CONFIG_PROVIDER_TOKEN, ConfigProvider } from './providers/config.provider.js';
import { LOG_PROVIDER_TOKEN, LogProvider } from './providers/log.provider.js';

const ioc = getBeverlyIocContainer();
const logProvider = ioc.resolve<LogProvider>(LOG_PROVIDER_TOKEN);
const configProvider = ioc.resolve<ConfigProvider>(CONFIG_PROVIDER_TOKEN);
const beverlyApp = ioc.resolve<BeverlyApp>(BERVERLY_APP_TOKEN);

function signalHandler(signal: NodeJS.Signals): void {
  logProvider.info({ msg: `${signal} received, bye` });
  void beverlyApp.stop();
  process.exit(0);
}

process.on('SIGINT', () => signalHandler('SIGINT'));
process.on('SIGTERM', () => signalHandler('SIGTERM'));

process.on('uncaughtException', (error: Error, origin: NodeJS.UncaughtExceptionOrigin): void => {
  logProvider.exception(error, { msg: 'uncaughtException', payload: origin });
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>): void => {
  logProvider.exception(reason, { msg: 'unhandledRejection', payload: promise });
});

await beverlyApp.start();

const url = `http://localhost:${configProvider.listenPort}`;
if (process.env.AUTO_OPEN === '1') {
  logProvider.info({ msg: `beverly started, opening default browser to ${url}` });
  await open(`http://localhost:${configProvider.listenPort}`);
} else {
  logProvider.info({ msg: `beverly started, navigate to ${url}` });
}
