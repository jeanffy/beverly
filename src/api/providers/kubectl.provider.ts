export const KUBECTL_PROVIDER_TOKEN = Symbol.for('KubectlProvider');

export interface KubectlContext {
  readonly contextName?: string;
  readonly nsName?: string;
}

export interface KubectlProvider {
  context?: KubectlContext;
  call<T>(cmd: string, contextOverride?: KubectlContext): Promise<T>;
}
