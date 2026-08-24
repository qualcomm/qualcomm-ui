// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getDocument, raf} from "@qualcomm-ui/dom/query"

import {FocusTrap} from "./focus-trap.js"
import type {FocusTrapOptions} from "./focus-trap.types.js"

type ElementOrNull = HTMLElement | null

type ElementOrGetter =
  | ElementOrNull
  | ElementOrNull[]
  | (() => ElementOrNull | ElementOrNull[])

export interface TrapFocusOptions extends Omit<FocusTrapOptions, "document"> {}

/**
 * Contain focus within one or more elements until the returned cleanup runs.
 *
 * Multiple containers form one tab cycle in the order given. They must not nest,
 * and no trapped node may have a positive `tabindex`; both throw.
 */
export function trapFocus(el: ElementOrGetter, options: TrapFocusOptions = {}) {
  let trap: FocusTrap | undefined
  const cleanup = raf(() => {
    const resolved = typeof el === "function" ? el() : el
    const containers = (Array.isArray(resolved) ? resolved : [resolved]).filter(
      (node): node is HTMLElement => !!node,
    )

    if (!containers.length) {
      return
    }

    trap = new FocusTrap(containers, {
      allowOutsideClick: true,
      delayInitialFocus: false,
      escapeDeactivates: false,
      fallbackFocus: containers[0],
      preventScroll: true,
      returnFocusOnDeactivate: true,
      ...options,
      document: getDocument(containers[0]),
    })

    try {
      trap.activate()
    } catch {}
  })

  return function destroy(): void {
    trap?.deactivate()
    cleanup()
  }
}

export {FocusTrap, type FocusTrapOptions}
