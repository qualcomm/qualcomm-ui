// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {addDomEvent} from "./event"
import {raf} from "./raf"
import {getNextTabbable, getTabbableEdges} from "./tabbable"
import type {MaybeElement, MaybeElementOrFn} from "./types"

/**
 *
 * Options that tune the behaviour of {@link proxyTabFocus}.
 *
 * @template T The element type (or getter returning that element) supplied
 * to `triggerElement`.
 */
export interface ProxyTabFocusOptions<T = MaybeElement> {
  /**
   * Register the key-down listener during the next animation frame instead of
   * immediately.  Enable this when the element(s) involved are not yet present
   * in the DOM at the moment you call `proxyTabFocus`.
   */
  defer?: boolean | undefined

  /**
   * Hook that fires right before focus is moved by the proxy logic.
   *
   * When provided, the callback is responsible for moving focus—call
   * `elementToFocus.focus()` yourself.
   * If omitted, `proxyTabFocus` performs `elementToFocus.focus()` automatically.
   */
  onFocus?: ((elementToFocus: HTMLElement) => void) | undefined

  /**
   * Invoked exactly once, the first time keyboard focus "enters" the container
   * via the proxy (i.e. when the user Tabs from `triggerElement` into
   * `container` or Shift-Tabs from the element after `triggerElement`
   * back into `container`).
   */
  onFocusEnter?: VoidFunction | undefined

  /**
   * Element that acts as the gateway into/out of the focus-trap area, or a function
   * returning that element.
   *
   * Tab *forward* from `triggerElement` lands on the first tabbable element in the
   * container.
   *
   * Shift-Tab *backward* from the element immediately **after** `triggerElement`
   * lands on the last tabbable element in the container.
   */
  triggerElement?: T | undefined
}

function proxyTabFocusImpl(
  container: MaybeElement,
  options: ProxyTabFocusOptions = {},
): VoidFunction {
  const {onFocus, onFocusEnter, triggerElement} = options

  const doc = container?.ownerDocument || document
  const body = doc.body

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== "Tab") {
      return
    }

    let elementToFocus: MaybeElement | undefined = null

    // get all tabbable elements within the container
    const [firstTabbable, lastTabbable] = getTabbableEdges(container, true)
    const nextTabbableAfterTrigger = getNextTabbable(body, triggerElement)

    const noTabbableElements = !firstTabbable && !lastTabbable

    // if we're focused on the element after the reference element and the user tabs
    // backwards we want to focus the last tabbable element
    if (event.shiftKey && nextTabbableAfterTrigger === doc.activeElement) {
      onFocusEnter?.()
      elementToFocus = lastTabbable
    }
    // if we're focused on the first tabbable element and the user tabs backwards
    // we want to focus the reference element
    else if (
      event.shiftKey &&
      (doc.activeElement === firstTabbable || noTabbableElements)
    ) {
      elementToFocus = triggerElement
    }
    // if we're focused on the reference element and the user tabs forwards
    // we want to focus the first tabbable element
    else if (!event.shiftKey && doc.activeElement === triggerElement) {
      onFocusEnter?.()
      elementToFocus = firstTabbable
    }
    // if we're focused on the last tabbable element and the user tabs forwards
    // we want to focus the next tabbable element after the reference element
    else if (
      !event.shiftKey &&
      (doc.activeElement === lastTabbable || noTabbableElements)
    ) {
      elementToFocus = nextTabbableAfterTrigger
    }

    if (!elementToFocus) {
      return
    }

    event.preventDefault()

    if (typeof onFocus === "function") {
      onFocus(elementToFocus)
    } else {
      elementToFocus.focus()
    }
  }

  // listen for the tab key in the capture phase
  return addDomEvent(doc, "keydown", onKeyDown, true)
}

/**
 * Installs keyboard Tab trapping for a DOM subtree.
 *
 * When focus is on `triggerElement` (or inside `container`) and the user
 * presses Tab / Shift + Tab, the handler redirects focus so it never leaves the
 * `container`.  The listener is added to the owning document in the *capture*
 * phase and stays active until the cleanup function returned by this call is
 * executed.
 *
 * @template T
 *
 * @returns {VoidFunction} Call this function to remove the `keydown` listener and clean up internal resources.
 */
export function proxyTabFocus(
  container: MaybeElementOrFn,
  options: ProxyTabFocusOptions<MaybeElementOrFn>,
): VoidFunction {
  const {defer, triggerElement, ...restOptions} = options
  const func = defer ? raf : (v: any) => v()
  const cleanups: (VoidFunction | undefined)[] = []
  cleanups.push(
    func(() => {
      const node = typeof container === "function" ? container() : container
      const trigger =
        typeof triggerElement === "function" ? triggerElement() : triggerElement
      cleanups.push(
        proxyTabFocusImpl(node, {triggerElement: trigger, ...restOptions}),
      )
    }),
  )
  return () => {
    cleanups.forEach((fn) => fn?.())
  }
}
