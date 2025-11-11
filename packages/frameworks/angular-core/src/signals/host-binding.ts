import {
  assertInInjectionContext,
  effect,
  ElementRef,
  type HostBinding,
  inject,
  Injector,
  Renderer2,
  RendererStyleFlags2,
  runInInjectionContext,
  type Signal,
  type WritableSignal,
} from "@angular/core"

/**
 * `assertInjector` extends `assertInInjectionContext` with an optional `Injector`
 * After assertion, `assertInjector` runs the `runner` function with the guaranteed
 * `Injector` whether it is the default `Injector` within the current **Injection
 * Context** or the custom `Injector` that was passed in.
 *
 * @template {() => any} Runner - Runner is a function that can return anything
 * @param {Function} fn - the Function to pass in `assertInInjectionContext`
 * @param {Injector | undefined | null} injector - the optional "custom" Injector
 * @param {Runner} runner - the runner fn
 * @returns {ReturnType<Runner>} result - returns the result of the Runner
 *
 * @example
 * ```ts
 * function injectValue(injector?: Injector) {
 *  return assertInjector(injectValue, injector, () => 'value');
 * }
 *
 * injectValue(); // string
 * ```
 */
export function assertInjector<Runner extends () => any>(
  fn: Function,
  injector: Injector | undefined | null,
  runner: Runner,
): ReturnType<Runner>

/**
 * `assertInjector` extends `assertInInjectionContext` with an optional `Injector`
 * After assertion, `assertInjector` returns a guaranteed `Injector` whether it is
 * the default `Injector` within the current **Injection Context** or the custom
 * `Injector` that was passed in.
 *
 * @param {Function} fn - the Function to pass in `assertInInjectionContext`
 * @param {Injector | undefined | null} injector - the optional "custom" Injector
 * @returns Injector
 */
export function assertInjector(
  fn: Function,
  injector: Injector | undefined | null,
): Injector
export function assertInjector(
  fn: Function,
  injector: Injector | undefined | null,
  runner?: () => any,
) {
  if (!injector) {
    assertInInjectionContext(fn)
  }
  const assertedInjector = injector ?? inject(Injector)

  if (!runner) {
    return assertedInjector
  }
  return runInInjectionContext(assertedInjector, runner)
}

/**
 * `hostBinding` takes a `hostPropertyName` to attach a data property, a class, a
 * style or an attribute (as `@HostBinding` would) to the host. The update is
 * applied based on the update of the provided signal.
 *
 * @param hostPropertyName - the same property that is bound to a data property, a class, a style or an attribute as `@HostBinding`.
 * @param signal - the signal on which to react to changes to update the host, and the one that will be returned as it is
 * @returns {Signal | WritableSignal}
 *
 * @example
 * ```ts
 * export class MyComponent {
 *  readonly background = hostBinding('style.background', signal('blue'));
 *
 *  constructor() {
 *    setTimeout(() => this.background.set('red'), 3000);
 *  }
 * }
 * ```
 *
 * TODO: verify with SSR
 */
export function hostBinding<T, S extends Signal<T> | WritableSignal<T>>(
  hostPropertyName: Required<HostBinding>["hostPropertyName"],
  signal: S,
  injector?: Injector,
): S {
  injector = assertInjector(hostBinding, injector)

  runInInjectionContext(injector, () => {
    const renderer = inject(Renderer2)
    const element: HTMLElement = inject(ElementRef).nativeElement

    effect(() => {
      let prevClasses: string[] = []
      const value = signal()
      const [binding, property, unit] = hostPropertyName.split(".")

      switch (binding) {
        case "style":
          renderer.setStyle(
            element,
            property,
            `${value}${unit ?? ""}`,
            property.startsWith("--")
              ? RendererStyleFlags2.DashCase
              : undefined,
          )
          break
        case "attr":
          if (value == null) {
            renderer.removeAttribute(element, property)
          } else {
            renderer.setAttribute(element, property, String(value))
          }
          break
        case "class":
          if (!property) {
            if (prevClasses.length) {
              prevClasses.forEach((k) => renderer.removeClass(element, k))
            }
            prevClasses =
              typeof value === "string" ? value.split(" ").filter(Boolean) : []
            prevClasses.forEach((k) => renderer.addClass(element, k))
          } else {
            if (value) {
              renderer.addClass(element, property)
            } else {
              renderer.removeClass(element, property)
            }
          }
          break
        default:
          renderer.setProperty(element, binding, value)
      }
    })
  })

  return signal
}
