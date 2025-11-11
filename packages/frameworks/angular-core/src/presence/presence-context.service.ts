import {
  computed,
  Injectable,
  type Provider,
  signal,
  type Signal,
} from "@angular/core"

import type {PresenceApi} from "@qualcomm-ui/core/presence"

@Injectable()
export class PresenceContextService {
  readonly initialized = signal(false)

  protected get context() {
    if (!this._context) {
      throw new Error("context not initialized")
    }
    return this._context
  }
  private _context: Signal<PresenceApi> | undefined

  init(computedApi: Signal<PresenceApi>): void {
    if (this._context) {
      throw new Error("context already initialized")
    }
    this._context = computedApi
    this.initialized.set(true)
  }

  setNode(node: HTMLElement | null) {
    this.context().setNode(node)
  }

  immediatePresent: boolean | undefined

  private _wasEverPresent: boolean = false

  readonly wasEverPresent = computed<boolean>(() => {
    if (this.context().present) {
      this._wasEverPresent = true
    }
    return this._wasEverPresent
  })

  readonly unmounted = computed<boolean | undefined>(() => {
    const lazyMount = this.context().lazyMount
    const present = this.context().present
    const unmountOnExit = this.context().unmountOnExit
    const wasEverPresent = this.wasEverPresent()

    return (
      (!present && !wasEverPresent && lazyMount) ||
      (unmountOnExit && !present && wasEverPresent)
    )
  })

  readonly getPresenceBindings = computed(() => {
    return {
      "data-state":
        this.context().skip && this.context().skipAnimationOnMount
          ? undefined
          : this.immediatePresent
            ? "open"
            : "closed",
      hidden: !this.context().present,
    }
  })
}

export function providePresenceContext(): Provider[] {
  return [PresenceContextService]
}
