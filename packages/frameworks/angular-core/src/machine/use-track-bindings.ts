import {
  effect,
  ElementRef,
  inject,
  Injector,
  Renderer2,
  RendererStyleFlags2,
  runInInjectionContext,
  type Signal,
  signal,
} from "@angular/core"

import {isEqual} from "@qualcomm-ui/utils/equal"
import {isFunction, isNumber, isString} from "@qualcomm-ui/utils/guard"

import {mergeProps} from "./merge-props"
import type {Dict, StyleObject} from "./normalize-props"

export interface TrackBindingsConfig {
  debug?: boolean | undefined

  /**
   * If true, the default prop spreader for this part will not be initialized.
   */
  disabled?: boolean | undefined

  /**
   * Override the ElementRef target for the property spreader function.
   */
  elementRef?: ElementRef | (() => ElementRef)

  /**
   * Prop getter for additional props to spread onto the host element.
   */
  extraBindings?: (() => Dict) | Signal<Dict>
}

type InitTrackerFn = ((opts?: TrackBindingsConfig) => void) & {
  /**
   * Add additional props to spread onto the host element.
   */
  extendWith: (computedProps: () => Dict) => void
  setDisabled: (disabled: boolean) => void
}

/**
 * Creates a reactive property binding system that dynamically applies computed
 * properties to a host element. This function sets up an effect that watches for
 * changes in the provided property getter and efficiently updates the DOM element
 * accordingly.
 *
 * @param propGetter - A function that returns a dictionary of properties to bind to the element.
 *   Supports attributes, CSS classes, styles, event listeners, and DOM properties.
 *
 * @returns An initialization function that starts the reactive binding process
 *
 * @example
 * ```typescript
 * @Component({
 *   selector: 'my-component',
 *   template: '<div>Content</div>'
 * })
 * export class MyComponent {
 *   protected readonly isExpanded = signal(false)
 *
 *   private readonly trackBindings = useTrackBindings(() => ({
 *     class: 'active component',
 *     'aria-expanded': this.isExpanded(),
 *   }))
 *
 *   ngOnInit() {
 *     // Start the reactive binding
 *     this.trackBindings()
 *   }
 * }
 * ```
 */
export function useTrackBindings(propGetter: () => Dict): InitTrackerFn {
  let shouldDebug: boolean | undefined
  let disabled = false
  const additionalPropGetters: (() => Dict)[] = []
  const debug = (...args: any[]) => {
    if (shouldDebug) {
      console.debug(...args)
    }
  }

  let elementRef = inject(ElementRef<HTMLElement>)
  const renderer = inject(Renderer2)
  const listeners = new Map<string, VoidFunction>()
  const injector = inject(Injector)

  let prev: Dict = {}

  function removeClass(names?: string) {
    if (!names) {
      return
    }
    const el = elementRef.nativeElement
    for (const name of names.split(",")) {
      renderer.removeClass(el, name)
    }
  }

  function addClass(names: string) {
    const el = elementRef.nativeElement
    for (const name of names.split(",")) {
      for (const className of name.split(" ")) {
        renderer.addClass(el, className)
      }
    }
  }
  function removeStyle(style?: StyleObject) {
    if (!style) {
      return
    }
    const el = elementRef.nativeElement
    for (const name of Object.keys(style)) {
      renderer.removeStyle(el, name, RendererStyleFlags2.DashCase)
    }
  }

  function addStyle(style: StyleObject) {
    const el = elementRef.nativeElement
    for (const [name, value] of Object.entries(style)) {
      renderer.setStyle(el, name, value, RendererStyleFlags2.DashCase)
    }
  }

  function addEventListener(name: string, callback: EventListener) {
    const eventName = name.substring(2)
    debug(`Binding event: ${name} -> ${eventName}`)
    listeners.get(name)?.()
    const unlisten = renderer.listen(
      elementRef.nativeElement,
      name.substring(2),
      callback,
    )
    listeners.set(name, unlisten)
  }

  function handleAttrs(prevProps: Dict, nextProps: Dict): void {
    const el = elementRef.nativeElement

    for (const [name, value] of Object.entries(prevProps)) {
      if (name in nextProps) {
        continue
      }
      if (name.startsWith("on")) {
        listeners.get(name)?.()
        listeners.delete(name) // Ensure cleanup
        continue
      }
      switch (name) {
        case "class":
          removeClass(value as string)
          continue
        case "style":
          removeStyle(value as StyleObject)
          continue
        case "value":
          renderer.setProperty(el, "value", undefined)
          continue
        case "textContent":
          renderer.setProperty(el, "textContent", "")
          continue
        case "checked":
          renderer.setProperty(el, "checked", false)
          continue
      }
      renderer.removeAttribute(el, name)
    }

    for (const [name, value] of Object.entries(nextProps)) {
      if (name in prevProps && isEqual(value, prevProps[name])) {
        continue
      }
      if (name.startsWith("on")) {
        const prevHandler = prevProps[name]
        // Skip if it's the exact same function reference
        if (isEqual(prevHandler, value)) {
          continue
        }
        addEventListener(name, value as EventListener)
        continue
      }

      switch (name) {
        case "class":
          removeClass(prevProps[name] as string)
          addClass(value as string)
          continue
        case "style":
          removeStyle(prevProps[name] as StyleObject)
          addStyle(value as StyleObject)
          continue
        case "value":
        case "checked":
        case "textContent":
          renderer.setAttribute(el, name, `${value}`)
          renderer.setProperty(el, name, value)
          continue
      }
      if (isString(value) || isNumber(value)) {
        renderer.setAttribute(el, name, `${value}`)
        continue
      }
      if (value === true) {
        renderer.setAttribute(el, name, "")
      } else {
        renderer.removeAttribute(el, name)
      }
    }
  }

  const initialized = signal(false)

  function getNextBindings() {
    if (!additionalPropGetters.length) {
      return propGetter()
    }
    return additionalPropGetters.reduce((acc: Dict, current) => {
      return mergeProps(acc, current())
    }, propGetter())
  }

  runInInjectionContext(injector, () => {
    effect(() => {
      // only start running the effect after the implementing component initializes.
      // This is used to prevent the binding operation from starting before the
      // parent machine has fully initialized.
      if (initialized()) {
        const next = getNextBindings()
        if (!isEqual(next, prev)) {
          handleAttrs(prev, next)
          prev = {...next}
        }
      }
    })
  })

  const initFn: InitTrackerFn = function (opts: TrackBindingsConfig = {}) {
    if (opts.disabled || disabled) {
      return
    }
    shouldDebug = opts.debug
    if (opts.elementRef) {
      elementRef = isFunction(opts.elementRef)
        ? opts.elementRef()
        : opts.elementRef
    }
    if (opts.extraBindings) {
      additionalPropGetters.push(opts.extraBindings)
    }

    initialized.set(true)
  } as InitTrackerFn

  initFn.extendWith = (extraProps: () => Dict) => {
    additionalPropGetters.push(extraProps)
  }

  initFn.setDisabled = (isDisabled: boolean) => {
    disabled = isDisabled
  }

  return initFn
}

export function applyBindings(
  el: HTMLElement,
  props: Dict,
  renderer: Renderer2,
): void {
  function removeClass(names?: string) {
    if (!names) {
      return
    }
    for (const name of names.split(",")) {
      renderer.removeClass(el, name)
    }
  }

  function addClass(names: string) {
    for (const name of names.split(",")) {
      for (const className of name.split(" ")) {
        renderer.addClass(el, className)
      }
    }
  }
  function removeStyle(style?: StyleObject) {
    if (!style) {
      return
    }
    for (const name of Object.keys(style)) {
      renderer.removeStyle(el, name, RendererStyleFlags2.DashCase)
    }
  }

  function addStyle(style: StyleObject) {
    for (const [name, value] of Object.entries(style)) {
      renderer.setStyle(el, name, value, RendererStyleFlags2.DashCase)
    }
  }

  for (const [name, value] of Object.entries(props)) {
    if (name.startsWith("on")) {
      // skip event listeners
    }

    switch (name) {
      case "class":
        removeClass(value as string)
        addClass(value as string)
        continue
      case "style":
        removeStyle(value as StyleObject)
        addStyle(value as StyleObject)
        continue
      case "value":
      case "checked":
      case "textContent":
        renderer.setAttribute(el, name, `${value}`)
        renderer.setProperty(el, name, value)
        continue
    }
    if (isString(value) || isNumber(value)) {
      renderer.setAttribute(el, name, `${value}`)
      continue
    }
    if (value === true) {
      renderer.setAttribute(el, name, "")
    } else {
      renderer.removeAttribute(el, name)
    }
  }
}
