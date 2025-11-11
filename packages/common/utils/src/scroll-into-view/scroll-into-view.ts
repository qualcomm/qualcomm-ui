// Modified from https://github.com/scroll-into-view/scroll-into-view-if-needed
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type Options as BaseOptions,
  compute,
  type ScrollAction,
} from "./compute-scroll-into-view"

/**
 * Only scrolls if the `node` is partially out of view:
 * ```ts
 * scrollIntoView(node, { scrollMode: 'if-needed' })
 * ```
 * Skips scrolling `overflow: hidden` elements:
 * ```ts
 * scrollIntoView(node, { skipOverflowHiddenElements: true })
 * ```
 * When scrolling is needed do the least and smoothest scrolling possible:
 * ```ts
 * scrollIntoView(node, {
 * behavior: 'smooth',
 * scrollMode: 'if-needed',
 * block: 'nearest',
 * inline: 'nearest',
 * })
 * ```
 */
export interface StandardBehaviorOptions extends BaseOptions {
  /**
   * @default 'auto
   */
  behavior?: ScrollBehavior
}

export interface CustomBehaviorOptions<T = unknown> extends BaseOptions {
  behavior: CustomScrollBehaviorCallback<T>
}

export type CustomScrollBehaviorCallback<T = unknown> = (
  actions: ScrollAction[],
) => T

const isStandardScrollBehavior = (
  options: any,
): options is StandardBehaviorOptions =>
  options === Object(options) && Object.keys(options).length !== 0

const isCustomScrollBehavior = <T = unknown>(
  options: any,
): options is CustomBehaviorOptions<T> =>
  typeof options === "object" ? typeof options.behavior === "function" : false

const getOptions = (options: any): StandardBehaviorOptions => {
  // Handle alignToTop for legacy reasons, to be compatible with the spec
  if (options === false) {
    return {block: "end", inline: "nearest"}
  }

  if (isStandardScrollBehavior(options)) {
    // compute.ts ensures the defaults are block: 'center' and inline: 'nearest', to
    // conform to the spec
    return options
  }

  // if options = {}, options = true or options = null, based on w3c web platform
  // test
  return {block: "start", inline: "nearest"}
}

const getScrollMargins = (target: Element) => {
  const computedStyle = window.getComputedStyle(target)
  return {
    bottom: parseFloat(computedStyle.scrollMarginBottom) || 0,
    left: parseFloat(computedStyle.scrollMarginLeft) || 0,
    right: parseFloat(computedStyle.scrollMarginRight) || 0,
    top: parseFloat(computedStyle.scrollMarginTop) || 0,
  }
}

// Determine if the element is part of the document (including shadow dom)
// Derived from code of Andy Desmarais
// https://terodox.tech/how-to-tell-if-an-element-is-in-the-dom-including-the-shadow-dom/
const isInDocument = (element: Node) => {
  let currentElement = element
  while (currentElement && currentElement.parentNode) {
    if (currentElement.parentNode === document) {
      return true
    } else if (currentElement.parentNode instanceof ShadowRoot) {
      currentElement = currentElement.parentNode.host
    } else {
      currentElement = currentElement.parentNode
    }
  }
  return false
}

export function scrollIntoView<T = unknown>(
  target: Element,
  options?: StandardBehaviorOptions | CustomBehaviorOptions<T> | boolean,
): T | void {
  // Browsers treats targets that aren't in the dom as a no-op and so should we
  if (!target.isConnected || !isInDocument(target)) {
    return
  }

  const margins = getScrollMargins(target)

  if (isCustomScrollBehavior<T>(options)) {
    return options.behavior(compute(target, options))
  }

  const behavior = typeof options === "boolean" ? undefined : options?.behavior

  for (const {el, left, top} of compute(target, getOptions(options))) {
    const adjustedTop = top - margins.top + margins.bottom
    const adjustedLeft = left - margins.left + margins.right
    el.scroll({behavior, left: adjustedLeft, top: adjustedTop})
  }
}
