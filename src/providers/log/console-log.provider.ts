import { injectable } from 'inversify';
import { LogParams, LogProvider } from './log.provider.js';

enum LogType {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Exception = 'exception',
}

interface LogProps {
  type: LogType;
  message: string;
  payload: unknown | null;
}

interface LogExceptionProps extends LogProps {
  error: string[] | unknown | null;
}

@injectable()
export class ConsoleLogProvider implements LogProvider {
  public debug(params: LogParams): void {
    // eslint-disable-next-line no-console
    this.commonLog(console.debug, LogType.Debug, params);
  }

  public info(params: LogParams): void {
    // eslint-disable-next-line no-console
    this.commonLog(console.info, LogType.Info, params);
  }

  public warning(params: LogParams): void {
    // eslint-disable-next-line no-console
    this.commonLog(console.warn, LogType.Warning, params);
  }

  public error(params: LogParams): void {
    // eslint-disable-next-line no-console
    this.commonLog(console.error, LogType.Error, params);
  }

  private commonLog(
    fn: (message?: unknown, ...optionalParams: unknown[]) => void,
    type: LogType,
    params: LogParams,
  ): void {
    const props: LogProps = {
      type: type,
      message: params.msg,
      payload: params.payload ?? null,
    };

    fn(JSON.stringify(props));
  }

  public exception(error: unknown, params: LogParams): void {
    let errorProp = error;
    if (error !== undefined && error instanceof Error && error.stack !== undefined) {
      errorProp = error.stack.split('\n').map(l => l.trim());
    }

    let payload = params.payload;
    if (
      params.payload !== undefined &&
      params.payload instanceof Error &&
      params.payload.cause !== undefined &&
      params.payload.cause instanceof Error &&
      params.payload.cause.stack !== undefined
    ) {
      payload = params.payload.cause.stack.split('\n').map(l => l.trim());
    }

    const props: LogExceptionProps = {
      type: LogType.Exception,
      message: params.msg,
      payload: payload ?? null,
      error: errorProp ?? null,
    };

    console.error(JSON.stringify(props));
  }
}
