export const LOG_PROVIDER_TOKEN = Symbol.for('LogProvider');

export interface LogProviderParams {
  msg: string;
  payload?: unknown;
}

export interface LogProvider {
  debug(params: LogProviderParams): void;
  info(params: LogProviderParams): void;
  warning(params: LogProviderParams): void;
  error(params: LogProviderParams): void;
  exception(error: unknown, params: LogProviderParams): void;
}
