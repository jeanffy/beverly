import { Container, ContainerModule, interfaces } from 'inversify';
import { ZeppelinApp } from './app.js';
import { CONFIG_PROVIDER_TOKEN, ConfigProvider } from './providers/config/config.provider.js';
import { EnvConfigProvider } from './providers/config/env-config.provider.js';
import { ConsoleLogProvider } from './providers/log/console-log.provider.js';
import { LOG_PROVIDER_TOKEN, LogProvider } from './providers/log/log.provider.js';

export class ZeppelinIoc {
  private iocContainer = new Container();

  public constructor() {
    this.iocContainer.load(this.getModule());
  }

  public getModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<LogProvider>(LOG_PROVIDER_TOKEN).to(ConsoleLogProvider).inSingletonScope();
      bind<ConfigProvider>(CONFIG_PROVIDER_TOKEN).to(EnvConfigProvider).inSingletonScope();
      bind<ZeppelinApp>(ZeppelinApp).toSelf();
    });
  }

  public getContainer(): Container {
    return this.iocContainer;
  }

  public async dispose(): Promise<void> {
    await this.iocContainer.unbindAllAsync();
    await this.iocContainer.unloadAsync();
  }
}

let zeppelinIocInstance: ZeppelinIoc | undefined;

export default function getZeppelinIoc(): ZeppelinIoc {
  if (zeppelinIocInstance === undefined) {
    zeppelinIocInstance = new ZeppelinIoc();
  }
  return zeppelinIocInstance;
}
