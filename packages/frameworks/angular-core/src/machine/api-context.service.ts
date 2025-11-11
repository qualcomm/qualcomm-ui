import {
  inject,
  Injectable,
  InjectionToken,
  type InjectOptions,
  type Provider,
  signal,
  type Signal,
} from "@angular/core"

/**
 * Manages the API context for a service.
 *
 * Provides a way to initialize and access an API signal, ensuring that it is only
 * set once. Attempting to reinitialize or access an uninitialized API will result
 * in errors.
 *
 * @template T - The type of the data returned by the API.
 */
@Injectable()
export abstract class BaseApiContextService<T> {
  readonly initialized = signal(false)

  get context() {
    if (!this._context) {
      throw new Error("context not initialized")
    }
    return this._context
  }
  private _context: Signal<T> | undefined

  init(computedApi: Signal<T>): void {
    if (this._context) {
      throw new Error("context already initialized")
    }
    this._context = computedApi
    this.initialized.set(true)
  }
}

export type UseContextOpts<Optional extends boolean = false> = InjectOptions & {
  /**
   * Use optional injection, and return `null` if the requested token is not found.
   */
  optional?: Optional
}

export type ApiContext<T> = [
  InjectionToken<() => T>,
  <Optional extends boolean = false>(
    opts?: UseContextOpts<Optional>,
  ) => Optional extends true ? (() => T) | null : () => T,
  () => Provider[],
]

export function createApiContext<
  T,
  K extends typeof BaseApiContextService<T> = typeof BaseApiContextService<T>,
>(name: string, service: K, initialValue?: T): ApiContext<T> {
  const token = new InjectionToken<() => T>(name)

  function useContext<Optional extends boolean = false>(
    opts: UseContextOpts<Optional> = {},
  ) {
    return inject(token, opts)
  }

  function getProviders(): Provider[] {
    return [
      service as any,
      {
        deps: [service],
        provide: token,
        useFactory: (context: BaseApiContextService<T>) => {
          if (!context.initialized() && initialValue !== undefined) {
            context.init(signal(initialValue))
          }
          return () => context.context()
        },
      },
    ]
  }

  return [token, useContext as ApiContext<T>[1], getProviders]
}
