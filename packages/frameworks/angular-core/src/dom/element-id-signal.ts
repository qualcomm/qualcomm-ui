// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type CreateSignalOptions,
  type DestroyRef,
  signal,
  type WritableSignal,
} from "@angular/core"

export type ElementIdSignal = WritableSignal<string> & {
  /**
   * Retrieves the id string, or undefined if it is empty. When you bind `undefined`
   * to an attribute in Angular, the attribute is removed from the DOM element.
   *
   * @example
   *
   * ```ts
   * @Component({
   *   template: `
   *     <div id="1" [attr.aria-labelledby]="emptyId"></div>
   *     <div id="2" [attr.aria-labelledby]="undefinedId"></div>
   *   `
   * })
   * class Component {
   *   emptyId = ""
   *   undefinedId = undefined
   * }
   *```
   *
   *```html
   * <!-- resulting DOM elements: -->
   * <!-- invalid DOM element: aria-labelledby must be set if defined -->
   * <div id="1" aria-labelledby></div>
   *
   * <!-- valid DOM element -->
   * <div id="2"></div>
   *```
   */
  asAttribute(): string | undefined

  set(value: string, destroyRef: DestroyRef): void
}

/**
 * A simple wrapper around a signal for tracking an element's id in a shared
 * service. This signal resets the value when its element's reference is destroyed.
 *
 * @param initialValue
 * @param options
 */
export function elementIdSignal(
  initialValue?: string,
  options?: CreateSignalOptions<string | undefined>,
) {
  const signalFn = signal(initialValue, options)
  const setter = signalFn.set

  ;(signalFn as unknown as ElementIdSignal).asAttribute = () =>
    signalFn() || undefined
  ;(signalFn as unknown as any).set = (
    value: string | undefined,
    destroyRef: DestroyRef,
  ) => {
    onElementDestroyed()
    onElementDestroyed = destroyRef.onDestroy(() => {
      setter(initialValue)
    })
    setter(value)
  }

  let onElementDestroyed = () => {}

  return signalFn as ElementIdSignal
}
