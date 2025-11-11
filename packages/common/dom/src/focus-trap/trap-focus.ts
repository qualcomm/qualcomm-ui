// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getDocument, raf} from "@qualcomm-ui/dom/query"

import {FocusTrap} from "./focus-trap"
import type {FocusTrapOptions} from "./focus-trap.types"

type ElementOrGetter = HTMLElement | null | (() => HTMLElement | null)

export interface TrapFocusOptions extends Omit<FocusTrapOptions, "document"> {}

export function trapFocus(el: ElementOrGetter, options: TrapFocusOptions = {}) {
  let trap: FocusTrap | undefined
  const cleanup = raf(() => {
    const contentEl = typeof el === "function" ? el() : el
    if (!contentEl) {
      return
    }

    trap = new FocusTrap(contentEl, {
      allowOutsideClick: true,
      delayInitialFocus: false,
      escapeDeactivates: false,
      fallbackFocus: contentEl,
      preventScroll: true,
      returnFocusOnDeactivate: true,
      ...options,
      document: getDocument(contentEl),
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
