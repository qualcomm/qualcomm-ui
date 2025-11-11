// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {MaybeFn} from "@qualcomm-ui/utils/guard"

import {contains} from "./node"
import {isAndroid, isApple, isMac} from "./platform"
import type {AnyPointerEvent, EventKeyOptions, NativeEvent} from "./types"

export function getBeforeInputValue(
  event: Pick<InputEvent, "currentTarget">,
): string {
  const {selectionEnd, selectionStart, value} =
    event.currentTarget as HTMLInputElement
  return (
    value.slice(0, selectionStart ?? -1) +
    (event as any).data +
    value.slice(selectionEnd ?? -1)
  )
}

function getComposedPath(event: any): EventTarget[] | undefined {
  return event.composedPath?.() ?? event.nativeEvent?.composedPath?.()
}

export function getEventTarget<T extends EventTarget>(
  event: Partial<Pick<UIEvent, "target" | "composedPath">>,
): T | null {
  const composedPath = getComposedPath(event)
  return (composedPath?.[0] ?? event.target) as T | null
}

export function isSelfTarget(
  event: Partial<Pick<UIEvent, "currentTarget" | "target" | "composedPath">>,
): boolean {
  return contains(event.currentTarget as Node, getEventTarget(event))
}

export function isOpeningInNewTab(
  event: Pick<MouseEvent, "currentTarget" | "metaKey" | "ctrlKey">,
): boolean {
  const element = event.currentTarget as
    | HTMLAnchorElement
    | HTMLButtonElement
    | HTMLInputElement
    | null
  if (!element) {
    return false
  }

  const isAppleDevice = isApple()
  if (isAppleDevice && !event.metaKey) {
    return false
  }
  if (!isAppleDevice && !event.ctrlKey) {
    return false
  }

  const localName = element.localName

  if (localName === "a") {
    return true
  }
  if (localName === "button" && element.type === "submit") {
    return true
  }
  if (localName === "input" && element.type === "submit") {
    return true
  }

  return false
}

export function isDownloadingEvent(
  event: Pick<MouseEvent, "altKey" | "currentTarget">,
): boolean {
  const element = event.currentTarget as
    | HTMLAnchorElement
    | HTMLButtonElement
    | HTMLInputElement
    | null
  if (!element) {
    return false
  }
  const localName = element.localName
  if (!event.altKey) {
    return false
  }
  if (localName === "a") {
    return true
  }
  if (localName === "button" && element.type === "submit") {
    return true
  }
  if (localName === "input" && element.type === "submit") {
    return true
  }
  return false
}

export function isComposingEvent(event: any): boolean {
  return getNativeEvent(event).isComposing
}

export function isKeyboardClick(
  e: Pick<MouseEvent, "detail" | "clientX" | "clientY">,
): boolean {
  return e.detail === 0 || (e.clientX === 0 && e.clientY === 0)
}

export function isPrintableKey(
  e: Pick<KeyboardEvent, "key" | "ctrlKey" | "metaKey">,
): boolean {
  return e.key.length === 1 && !e.ctrlKey && !e.metaKey
}

export function isVirtualPointerEvent(e: PointerEvent): boolean {
  return (
    (e.width === 0 && e.height === 0) ||
    (e.width === 1 &&
      e.height === 1 &&
      e.pressure === 0 &&
      e.detail === 0 &&
      e.pointerType === "mouse")
  )
}

export function isVirtualClick(e: MouseEvent | PointerEvent): boolean {
  if ((e as any).mozInputSource === 0 && e.isTrusted) {
    return true
  }
  if (isAndroid() && (e as PointerEvent).pointerType) {
    return e.type === "click" && e.buttons === 1
  }
  return e.detail === 0 && !(e as PointerEvent).pointerType
}

export function isLeftClick(e: Pick<MouseEvent, "button">): boolean {
  return e.button === 0
}

export function isContextMenuEvent(
  e: Pick<MouseEvent, "button" | "ctrlKey" | "metaKey">,
): boolean {
  return e.button === 2 || (isMac() && e.ctrlKey && e.button === 0)
}

export function isModifierKey(
  e: Pick<KeyboardEvent, "ctrlKey" | "metaKey" | "altKey">,
): boolean {
  return e.ctrlKey || e.altKey || e.metaKey
}

export const isTouchEvent = (event: AnyPointerEvent): event is TouchEvent =>
  "touches" in event && event.touches.length > 0

const keyMap: Record<string, string> = {
  " ": "Space",
  ",": "Comma",
  Down: "ArrowDown",
  Esc: "Escape",
  Left: "ArrowLeft",
  Right: "ArrowRight",
  Up: "ArrowUp",
}

const rtlKeyMap: Record<string, string> = {
  ArrowLeft: "ArrowRight",
  ArrowRight: "ArrowLeft",
}

export function getEventKey(
  event: Pick<KeyboardEvent, "key">,
  options: EventKeyOptions = {},
): string {
  const {dir = "ltr", orientation = "horizontal"} = options
  let key = event.key
  key = keyMap[key] ?? key
  const isRtl = dir === "rtl" && orientation === "horizontal"
  if (isRtl && key in rtlKeyMap) {
    key = rtlKeyMap[key]
  }
  return key
}

export function getNativeEvent<E>(event: E): NativeEvent<E> {
  return (event as any).nativeEvent ?? event
}

const pageKeys = new Set(["PageUp", "PageDown"])
const arrowKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"])

export function getEventStep(
  event: Pick<KeyboardEvent, "ctrlKey" | "metaKey" | "key" | "shiftKey">,
): 1 | 0.1 | 10 {
  if (event.ctrlKey || event.metaKey) {
    return 0.1
  } else {
    const isPageKey = pageKeys.has(event.key)
    const isSkipKey = isPageKey || (event.shiftKey && arrowKeys.has(event.key))
    return isSkipKey ? 10 : 1
  }
}

export function getEventPoint(
  event: any,
  type: "page" | "client" = "client",
): {x: number; y: number} {
  const point = isTouchEvent(event)
    ? event.touches[0] || event.changedTouches[0]
    : event
  return {x: point[`${type}X`], y: point[`${type}Y`]}
}

interface DOMEventMap
  extends DocumentEventMap,
    WindowEventMap,
    HTMLElementEventMap {}

export const addDomEvent = <K extends keyof DOMEventMap>(
  target: MaybeFn<EventTarget | null>,
  eventName: K,
  handler: (event: DOMEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
) => {
  const node = typeof target === "function" ? target() : target
  node?.addEventListener(eventName, handler as any, options)
  return (): void => {
    node?.removeEventListener(eventName, handler as any, options)
  }
}
