// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type FocusOutsideEvent,
  type InteractOutsideHandlers,
  type PointerDownOutsideEvent,
  trackInteractOutside,
} from "@qualcomm-ui/dom/interact-outside"
import {
  contains,
  getEventTarget,
  isHTMLElement,
  raf,
} from "@qualcomm-ui/dom/query"
import type {MaybeFunction} from "@qualcomm-ui/utils/functions"
import {isFunction} from "@qualcomm-ui/utils/guard"
import {warn} from "@qualcomm-ui/utils/warning"

import {trackEscapeKeydown} from "./escape-keydown"
import {
  type Layer,
  type LayerDismissEvent,
  layerStack,
  type LayerType,
} from "./layer-stack"
import {
  assignPointerEventToLayers,
  clearPointerEvent,
  disablePointerEventsOutside,
} from "./pointer-event-outside"

type MaybeElement = HTMLElement | null
type Container = MaybeElement | Array<MaybeElement>
type NodeOrFn = MaybeFunction<MaybeElement>

export interface DismissableElementHandlers extends InteractOutsideHandlers {
  /**
   * Function called when the escape key is pressed
   */
  onEscapeKeyDown?: ((event: KeyboardEvent) => void) | undefined
  /**
   * Function called when this layer is closed due to a parent layer being closed
   */
  onRequestDismiss?: ((event: LayerDismissEvent) => void) | undefined
}

export interface PersistentElementOptions {
  /**
   * Returns the persistent elements that:
   * - should not have pointer-events disabled
   * - should not trigger the dismiss event
   */
  persistentElements?: Array<() => Element | null> | undefined
}

export interface DismissableElementOptions
  extends DismissableElementHandlers,
    PersistentElementOptions {
  /**
   * Whether to log debug information
   */
  debug?: boolean | undefined
  /**
   * Defer the interact outside event to the next frame
   */
  defer?: boolean | undefined
  /**
   * Exclude containers from the interact outside event
   */
  exclude?: MaybeFunction<Container> | undefined
  /**
   * Function called when the dismissable element is dismissed
   */
  onDismiss: VoidFunction
  /**
   * Whether to block pointer events outside the dismissable element
   */
  pointerBlocking?: boolean | undefined
  /**
   * The type of layer being tracked
   */
  type?: LayerType | undefined
  /**
   * Whether to warn when the node is `null` or `undefined`
   */
  warnOnMissingNode?: boolean | undefined
}

function trackDismissableElementImpl(
  node: MaybeElement,
  options: DismissableElementOptions,
) {
  const {warnOnMissingNode = true} = options

  if (warnOnMissingNode && !node) {
    warn("[@qualcomm-ui/dom/dismissable] node is `null` or `undefined`")
    return
  }

  if (!node) {
    return
  }

  const {
    debug,
    exclude: excludeContainers,
    onDismiss,
    onRequestDismiss,
    pointerBlocking,
    type = "dialog",
  } = options

  const layer: Layer = {
    dismiss: onDismiss,
    node,
    pointerBlocking,
    requestDismiss: onRequestDismiss,
    type,
  }

  layerStack.add(layer)
  assignPointerEventToLayers()

  function onPointerDownOutside(event: PointerDownOutsideEvent) {
    const target = getEventTarget(event.detail.originalEvent)
    if (
      layerStack.isBelowPointerBlockingLayer(node) ||
      layerStack.isInBranch(target)
    ) {
      return
    }
    options.onPointerDownOutside?.(event)
    options.onInteractOutside?.(event)
    if (event.defaultPrevented) {
      return
    }
    if (debug) {
      console.log("onPointerDownOutside:", event.detail.originalEvent)
    }
    onDismiss?.()
  }

  function onFocusOutside(event: FocusOutsideEvent) {
    const target = getEventTarget(event.detail.originalEvent)
    if (layerStack.isInBranch(target)) {
      return
    }
    options.onFocusOutside?.(event)
    options.onInteractOutside?.(event)
    if (event.defaultPrevented) {
      return
    }
    if (debug) {
      console.log("onFocusOutside:", event.detail.originalEvent)
    }
    onDismiss?.()
  }

  function onEscapeKeyDown(event: KeyboardEvent) {
    if (!layerStack.isTopMost(node)) {
      return
    }
    options.onEscapeKeyDown?.(event)
    if (!event.defaultPrevented && onDismiss) {
      event.preventDefault()
      onDismiss()
    }
  }

  function exclude(target: Element) {
    if (!node) {
      return false
    }
    const containers =
      typeof excludeContainers === "function"
        ? excludeContainers()
        : excludeContainers
    const _containers = Array.isArray(containers) ? containers : [containers]
    const persistentElements = options.persistentElements
      ?.map((fn) => fn())
      .filter(isHTMLElement)
    if (persistentElements) {
      _containers.push(...persistentElements)
    }
    return (
      _containers.some((node) => contains(node, target)) ||
      layerStack.isInNestedLayer(node, target)
    )
  }

  const cleanups = [
    pointerBlocking
      ? disablePointerEventsOutside(node, options.persistentElements)
      : undefined,
    trackEscapeKeydown(node, onEscapeKeyDown),
    trackInteractOutside(node, {
      defer: options.defer,
      exclude,
      onFocusOutside,
      onPointerDownOutside,
    }),
  ]

  return () => {
    layerStack.remove(node)
    // re-assign pointer event to remaining layers
    assignPointerEventToLayers()
    // remove pointer event from removed layer
    clearPointerEvent(node)
    cleanups.forEach((fn) => fn?.())
  }
}

export function trackDismissableElement(
  nodeOrFn: NodeOrFn,
  options: DismissableElementOptions,
): VoidFunction {
  const {defer} = options
  const func = defer ? raf : (v: any) => v()
  const cleanups: (VoidFunction | undefined)[] = []
  cleanups.push(
    func(() => {
      const node = isFunction(nodeOrFn) ? nodeOrFn() : nodeOrFn
      cleanups.push(trackDismissableElementImpl(node, options))
    }),
  )
  return () => {
    cleanups.forEach((fn) => fn?.())
  }
}

export function trackDismissableBranch(
  nodeOrFn: NodeOrFn,
  options: {defer?: boolean | undefined} = {},
): VoidFunction {
  const {defer} = options
  const func = defer ? raf : (v: any) => v()
  const cleanups: (VoidFunction | undefined)[] = []

  cleanups.push(
    func(() => {
      const node = isFunction(nodeOrFn) ? nodeOrFn() : nodeOrFn
      if (!node) {
        warn("[@zag-js/dismissable] branch node is `null` or `undefined`")
        return
      }
      layerStack.addBranch(node)
      cleanups.push(() => {
        layerStack.removeBranch(node)
      })
    }),
  )

  return () => {
    cleanups.forEach((fn) => fn?.())
  }
}
