// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getTabbableEdges, getTabbables} from "./tabbable"

/**
 * Represents options for managing the initial focus within a focusable area.
 */
export interface InitialFocusOptions {
  enabled?: boolean | undefined
  filter?: ((el: HTMLElement) => boolean) | undefined
  getInitialEl?: (() => HTMLElement | null) | undefined
  root: HTMLElement | null
}

/**
 * Determines and returns the initial focusable element based on the provided
 * options.
 *
 * @param {InitialFocusOptions} options - Configuration options for determining the initial focus element.
 * @param {boolean} [options.enabled=true] - Whether the focus logic should be processed.
 * @param {(HTMLElement | (() => HTMLElement | null | undefined))} [options.getInitialEl] - A specific element or a function returning an element to set as the initial focus target.
 * @param {HTMLElement} [options.root] - The root container within which to search for focusable elements.
 * @param {(node: HTMLElement) => boolean} [options.filter] - A function to filter and prioritize focusable elements.
 * @return {HTMLElement | undefined} The element to receive initial focus, or `undefined` if no suitable element is found.
 */
export function getInitialFocus(
  options: InitialFocusOptions,
): HTMLElement | undefined {
  const {enabled = true, filter, getInitialEl, root} = options

  if (!enabled) {
    return
  }

  let node: HTMLElement | null | undefined = null

  node ||= typeof getInitialEl === "function" ? getInitialEl() : getInitialEl
  node ||= root?.querySelector<HTMLElement>("[data-autofocus],[autofocus]")

  if (!node) {
    const tabbables = getTabbables(root)
    node = filter ? tabbables.filter(filter)[0] : tabbables[0]
  }

  return node || root || undefined
}

export function isValidTabEvent(
  event: Pick<KeyboardEvent, "shiftKey" | "currentTarget">,
): boolean {
  const container = event.currentTarget as HTMLElement | null
  if (!container) {
    return false
  }

  const [firstTabbable, lastTabbable] = getTabbableEdges(container)
  const doc = container.ownerDocument || document

  if (doc.activeElement === firstTabbable && event.shiftKey) {
    return false
  }
  if (doc.activeElement === lastTabbable && !event.shiftKey) {
    return false
  }
  if (!firstTabbable && !lastTabbable) {
    return false
  }

  return true
}
