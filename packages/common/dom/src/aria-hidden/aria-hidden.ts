// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// Based on https://github.com/theKashey/aria-hidden/blob/master/src/index.ts
// Licensed under MIT

import {walkTreeOutside} from "./walk-tree-outside"

function getParentNode(
  originalTarget: Element | Element[],
): HTMLElement | null {
  const target = Array.isArray(originalTarget)
    ? originalTarget[0]
    : originalTarget
  return target.ownerDocument.body
}

export function hideOthers(
  originalTarget: Element | Element[],
  parentNode: HTMLElement | null = getParentNode(originalTarget),
  markerName = "data-aria-hidden",
): VoidFunction | undefined {
  if (!parentNode) {
    return
  }
  return walkTreeOutside(originalTarget, {
    controlAttribute: "aria-hidden",
    explicitBooleanValue: true,
    markerName,
    parentNode,
  })
}

function inertOthers(
  originalTarget: Element | Element[],
  parentNode: HTMLElement | null = getParentNode(originalTarget),
  markerName = "data-inerted",
): VoidFunction | undefined {
  if (!parentNode) {
    return
  }
  return walkTreeOutside(originalTarget, {
    controlAttribute: "inert",
    explicitBooleanValue: false,
    markerName,
    parentNode,
  })
}

const supportsInert = () =>
  typeof HTMLElement !== "undefined" &&
  HTMLElement.prototype.hasOwnProperty("inert")

export function suppressOthers(
  originalTarget: Element | Element[],
  parentNode?: HTMLElement,
  markerName: string = "data-suppressed",
): VoidFunction | undefined {
  const fn = supportsInert() ? inertOthers : hideOthers
  return fn(originalTarget, parentNode, markerName)
}

const raf = (fn: VoidFunction) => {
  const frameId = requestAnimationFrame(() => fn())
  return () => cancelAnimationFrame(frameId)
}

type MaybeElement = HTMLElement | null
type Targets = Array<MaybeElement>
type TargetsOrFn = Targets | (() => Targets)

type Options = {
  defer?: boolean
}

/**
 * Temporarily sets `aria-hidden="true"` on every element *except* the given
 * targets—a common pattern for modal dialogs or focus-trapped pop-overs.
 *
 * The operation is reversible: call the returned function to restore the
 * original `aria-hidden` state and cancel any pending `requestAnimationFrame`.
 *
 * @param {TargetsOrFn} targetsOrFn
 *        An array of DOM elements that must remain *visible* to assistive
 *        technologies, or a lazy function that returns such an array.  `null`
 *        entries are ignored.
 *
 * @param {Options}   [options]
 *        Behavioural flags.
 * @param {boolean}   [options.defer=true]
 *        If `true`, the mutation runs on the next animation frame.  Set to
 *        `false` when you are sure the targets are already in the DOM.
 *
 * @returns {VoidFunction}
 *          Invoke to undo the `aria-hidden` changes and tear down internal
 *          resources. ­Always call this to avoid memory leaks.
 *
 * @example
 * // Keep the modal and its backdrop visible, hide everything else:
 * const undo = ariaHidden([modalEl, backdropEl])
 * …
 * // When the modal closes:
 * undo()
 */
export function ariaHidden(
  targetsOrFn: TargetsOrFn,
  options: Options = {},
): VoidFunction {
  const {defer = true} = options
  const func = defer ? raf : (v: any) => v()
  const cleanups: (VoidFunction | undefined)[] = []
  cleanups.push(
    func(() => {
      const targets =
        typeof targetsOrFn === "function" ? targetsOrFn() : targetsOrFn
      const elements = targets.filter(Boolean)
      if (elements.length === 0) {
        return
      }
      cleanups.push(hideOthers(elements as Element[]))
    }),
  )
  return () => {
    cleanups.forEach((fn) => fn?.())
  }
}
