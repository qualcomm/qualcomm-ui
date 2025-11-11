// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  addDomEvent,
  contains,
  getDocument,
  getEventTarget,
  getNearestOverflowAncestor,
  getWindow,
  isContextMenuEvent,
  isFocusable,
  isHTMLElement,
  raf,
} from "@qualcomm-ui/dom/query"
import {callAll} from "@qualcomm-ui/utils/functions"

import {getParentWindow, getWindowFrames} from "./frame-utils"

export interface InteractOutsideHandlers {
  /**
   * Function called when the focus is moved outside the component
   * @inheritDoc
   */
  onFocusOutside?: ((event: FocusOutsideEvent) => void) | undefined
  /**
   * Function called when an interaction happens outside the component
   * @inheritDoc
   */
  onInteractOutside?: ((event: InteractOutsideEvent) => void) | undefined
  /**
   * Function called when the pointer is pressed down outside the component
   * @inheritDoc
   */
  onPointerDownOutside?: ((event: PointerDownOutsideEvent) => void) | undefined
}

export interface InteractOutsideOptions extends InteractOutsideHandlers {
  defer?: boolean | undefined
  exclude?: ((target: HTMLElement) => boolean) | undefined
}

export interface EventDetails<T> {
  contextmenu: boolean
  focusable: boolean
  originalEvent: T
}

const POINTER_OUTSIDE_EVENT = "pointerdown.outside"
const FOCUS_OUTSIDE_EVENT = "focus.outside"

export type PointerDownOutsideEvent = CustomEvent<EventDetails<PointerEvent>>

export type FocusOutsideEvent = CustomEvent<EventDetails<FocusEvent>>

export type InteractOutsideEvent = PointerDownOutsideEvent | FocusOutsideEvent

export type MaybeElement = HTMLElement | null | undefined
export type NodeOrFn = MaybeElement | (() => MaybeElement)

function isComposedPathFocusable(composedPath: EventTarget[]) {
  for (const node of composedPath) {
    if (isHTMLElement(node) && isFocusable(node)) {
      return true
    }
  }
  return false
}

const isPointerEvent = (event: Event): event is PointerEvent =>
  "clientY" in event

function isEventPointWithin(node: MaybeElement, event: Event) {
  if (!isPointerEvent(event) || !node) {
    return false
  }

  const rect = node.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) {
    return false
  }

  return (
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width
  )
}

function isPointInRect(
  rect: {height: number; width: number; x: number; y: number},
  point: {x: number; y: number},
) {
  return (
    rect.y <= point.y &&
    point.y <= rect.y + rect.height &&
    rect.x <= point.x &&
    point.x <= rect.x + rect.width
  )
}

function isEventWithinScrollbar(event: Event, ancestor: HTMLElement): boolean {
  if (!ancestor || !isPointerEvent(event)) {
    return false
  }

  const isScrollableY = ancestor.scrollHeight > ancestor.clientHeight
  const onScrollbarY =
    isScrollableY && event.clientX > ancestor.offsetLeft + ancestor.clientWidth

  const isScrollableX = ancestor.scrollWidth > ancestor.clientWidth
  const onScrollbarX =
    isScrollableX && event.clientY > ancestor.offsetTop + ancestor.clientHeight

  const rect = {
    height: ancestor.clientHeight + (isScrollableX ? 16 : 0),
    width: ancestor.clientWidth + (isScrollableY ? 16 : 0),
    x: ancestor.offsetLeft,
    y: ancestor.offsetTop,
  }

  const point = {
    x: event.clientX,
    y: event.clientY,
  }

  if (!isPointInRect(rect, point)) {
    return false
  }

  return onScrollbarY || onScrollbarX
}

function trackInteractOutsideImpl(
  node: MaybeElement,
  options: InteractOutsideOptions,
) {
  const {
    defer,
    exclude,
    onFocusOutside,
    onInteractOutside,
    onPointerDownOutside,
  } = options

  if (!node) {
    return
  }

  const doc = getDocument(node)
  const win = getWindow(node)
  const frames = getWindowFrames(win)
  const parentWin = getParentWindow(win)

  function isEventOutside(event: Event): boolean {
    const target = getEventTarget(event)
    if (!isHTMLElement(target)) {
      return false
    }

    // ignore disconnected nodes (removed from DOM)
    if (!target.isConnected) {
      return false
    }

    // ignore nodes that are inside the component
    if (contains(node, target)) {
      return false
    }

    // Ex: password manager selection
    if (isEventPointWithin(node, event)) {
      return false
    }

    if (!node) {
      return false
    }

    // Ex: page content that is scrollable
    const triggerEl = doc.querySelector(`[aria-controls="${node.id}"]`)
    if (triggerEl) {
      const triggerAncestor = getNearestOverflowAncestor(triggerEl)
      if (isEventWithinScrollbar(event, triggerAncestor)) {
        return false
      }
    }

    // Ex: dialog positioner that is scrollable
    const nodeAncestor = getNearestOverflowAncestor(node)
    if (isEventWithinScrollbar(event, nodeAncestor)) {
      return false
    }

    // Custom exclude function
    return !exclude?.(target)
  }

  const pointerdownCleanups: Set<VoidFunction> = new Set()

  function onPointerDown(event: PointerEvent) {
    //
    function handler() {
      const func = defer ? raf : (v: any) => v()
      const composedPath = event.composedPath?.() ?? [event.target]
      func(() => {
        if (!node || !isEventOutside(event)) {
          return
        }

        if (onPointerDownOutside || onInteractOutside) {
          const handler = callAll(
            onPointerDownOutside,
            onInteractOutside,
          ) as EventListener
          node.addEventListener(POINTER_OUTSIDE_EVENT, handler, {once: true})
        }

        fireCustomEvent(node, POINTER_OUTSIDE_EVENT, {
          bubbles: false,
          cancelable: true,
          detail: {
            contextmenu: isContextMenuEvent(event),
            focusable: isComposedPathFocusable(composedPath),
            originalEvent: event,
          },
        })
      })
    }

    if (event.pointerType === "touch") {
      // flush any pending pointerup events
      pointerdownCleanups.forEach((fn) => fn())
      // add a pointerup event listener to the document and all frame documents
      pointerdownCleanups.add(addDomEvent(doc, "click", handler, {once: true}))
      pointerdownCleanups.add(
        parentWin.addEventListener("click", handler, {once: true}),
      )
      pointerdownCleanups.add(
        frames.addEventListener("click", handler, {once: true}),
      )
    } else {
      handler()
    }
  }
  const cleanups = new Set<VoidFunction>()

  const timer = setTimeout(() => {
    cleanups.add(addDomEvent(doc, "pointerdown", onPointerDown, true))
    cleanups.add(parentWin.addEventListener("pointerdown", onPointerDown, true))
    cleanups.add(frames.addEventListener("pointerdown", onPointerDown, true))
  }, 0)

  function onFocusin(event: FocusEvent) {
    //
    const func = defer ? raf : (v: any) => v()
    func(() => {
      if (!node || !isEventOutside(event)) {
        return
      }

      if (onFocusOutside || onInteractOutside) {
        const handler = callAll(
          onFocusOutside,
          onInteractOutside,
        ) as EventListener
        node.addEventListener(FOCUS_OUTSIDE_EVENT, handler, {once: true})
      }

      fireCustomEvent(node, FOCUS_OUTSIDE_EVENT, {
        bubbles: false,
        cancelable: true,
        detail: {
          contextmenu: false,
          focusable: isFocusable(getEventTarget(event)),
          originalEvent: event,
        },
      })
    })
  }

  cleanups.add(addDomEvent(doc, "focusin", onFocusin, true))
  cleanups.add(parentWin.addEventListener("focusin", onFocusin, true))
  cleanups.add(frames.addEventListener("focusin", onFocusin, true))

  return () => {
    clearTimeout(timer)
    pointerdownCleanups.forEach((fn) => fn())
    cleanups.forEach((fn) => fn())
  }
}

export function trackInteractOutside(
  nodeOrFn: NodeOrFn,
  options: InteractOutsideOptions,
): VoidFunction {
  const {defer} = options
  const func = defer ? raf : (v: any) => v()
  const cleanups: (VoidFunction | undefined)[] = []
  cleanups.push(
    func(() => {
      const node = typeof nodeOrFn === "function" ? nodeOrFn() : nodeOrFn
      cleanups.push(trackInteractOutsideImpl(node, options))
    }),
  )
  return () => {
    cleanups.forEach((fn) => fn?.())
  }
}

function fireCustomEvent(
  el: HTMLElement,
  type: string,
  init?: CustomEventInit,
) {
  const win = el.ownerDocument.defaultView || window
  const event = new win.CustomEvent(type, init)
  return el.dispatchEvent(event)
}
