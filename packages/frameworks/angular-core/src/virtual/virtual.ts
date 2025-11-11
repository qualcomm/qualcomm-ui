/**
 * Forked from @tanstack/angular-virtual. TODO: create PR and fix the library.
 * Potential issue: the library intends to support older versions of Angular which
 * emits warnings on newer versions because they are using deprecated features. May
 * need to maintain this fork for a while.
 */
import {DOCUMENT} from "@angular/common"
import {
  afterNextRender,
  computed,
  DestroyRef,
  effect,
  type ElementRef,
  inject,
  InjectionToken,
  type Signal,
  signal,
  untracked,
} from "@angular/core"
import {
  elementScroll,
  observeElementOffset,
  observeElementRect,
  observeWindowOffset,
  observeWindowRect,
  type PartialKeys,
  Virtualizer,
  type VirtualizerOptions,
  windowScroll,
} from "@tanstack/virtual-core"

import {WINDOW} from "@qualcomm-ui/angular-core/dom"

import {proxyVirtualizer} from "./proxy"
import type {AngularVirtualizer} from "./types"

export * from "@tanstack/virtual-core"
export * from "./types"

function createVirtualizerBase<
  TScrollElement extends Element | Window,
  TItemElement extends Element,
>(
  options: Signal<VirtualizerOptions<TScrollElement, TItemElement>>,
): AngularVirtualizer<TScrollElement, TItemElement> {
  let virtualizer: Virtualizer<TScrollElement, TItemElement>
  function lazyInit() {
    virtualizer ??= new Virtualizer(options())
    return virtualizer
  }

  const virtualizerSignal = signal(virtualizer!, {equal: () => false})

  // two-way sync options
  effect(() => {
    const _options = options()
    lazyInit()
    virtualizerSignal.set(virtualizer)
    virtualizer.setOptions({
      ..._options,
      onChange: (instance, sync) => {
        // update virtualizerSignal so that dependent computeds recompute.
        virtualizerSignal.set(instance)
        _options.onChange?.(instance, sync)
      },
    })
    // update virtualizerSignal so that dependent computeds recompute.
    virtualizerSignal.set(virtualizer)
  })

  const scrollElement = computed(() => options().getScrollElement())
  // let the virtualizer know when the scroll element is changed
  effect(() => {
    const el = scrollElement()
    if (el) {
      untracked(virtualizerSignal)._willUpdate()
    }
  })

  let cleanup: () => void | undefined
  afterNextRender({read: () => (virtualizer ?? lazyInit())._didMount()})

  // @ts-ignore use before assign
  inject(DestroyRef).onDestroy(() => cleanup?.())

  return proxyVirtualizer(virtualizerSignal, lazyInit)
}

export const ANGULAR_VIRTUALIZER_INSTANCE_TOKEN = new InjectionToken<
  AngularVirtualizer<any, any>
>("VIRTUALIZER_TOKEN")

export type AngularVirtualizerOptions<
  TScrollElement extends Element,
  TItemElement extends Element,
> = PartialKeys<
  Omit<VirtualizerOptions<TScrollElement, TItemElement>, "getScrollElement">,
  "observeElementRect" | "observeElementOffset" | "scrollToFn"
> & {
  scrollElement: ElementRef<TScrollElement> | TScrollElement | undefined
}

export function injectVirtualizer<
  TScrollElement extends Element,
  TItemElement extends Element,
>(
  options: () => AngularVirtualizerOptions<TScrollElement, TItemElement>,
): AngularVirtualizer<TScrollElement, TItemElement> {
  const resolvedOptions = computed(() => {
    return {
      getScrollElement: () => {
        const elementOrRef = options().scrollElement
        return (
          (isElementRef(elementOrRef)
            ? elementOrRef.nativeElement
            : elementOrRef) ?? null
        )
      },
      observeElementOffset,
      observeElementRect,
      scrollToFn: elementScroll,
      ...options(),
    }
  })
  return createVirtualizerBase<TScrollElement, TItemElement>(resolvedOptions)
}

function isElementRef<T extends Element>(
  elementOrRef: ElementRef<T> | T | undefined,
): elementOrRef is ElementRef<T> {
  return elementOrRef != null && "nativeElement" in elementOrRef
}

export function injectWindowVirtualizer<TItemElement extends Element>(
  options: () => PartialKeys<
    VirtualizerOptions<Window, TItemElement>,
    | "getScrollElement"
    | "observeElementRect"
    | "observeElementOffset"
    | "scrollToFn"
  >,
): AngularVirtualizer<Window, TItemElement> {
  const document = inject(DOCUMENT)
  const window = inject(WINDOW)
  const resolvedOptions = computed(() => {
    return {
      getScrollElement: () => (typeof document !== "undefined" ? window : null),
      initialOffset: () =>
        typeof document !== "undefined" ? window.scrollY : 0,
      observeElementOffset: observeWindowOffset,
      observeElementRect: observeWindowRect,
      scrollToFn: windowScroll,
      ...options(),
    }
  })
  return createVirtualizerBase<Window, TItemElement>(resolvedOptions)
}
