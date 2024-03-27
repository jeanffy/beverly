export interface UseCase<T = unknown> {
  run(...parameters: unknown[]): Promise<T>;
}
