// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {addDomEvent, getEventPoint} from "./event"
import {disableTextSelection} from "./text-selection"
import type {Point} from "./types"

export interface PointerMoveDetails {
  /**
   * The event that triggered the move.
   */
  event: PointerEvent
  /**
   * The current position of the pointer.
   */
  point: Point
}

export interface PointerMoveHandlers {
  /**
   * Called when the pointer moves.
   */
  onPointerMove: (details: PointerMoveDetails) => void
  /**
   * Called when the pointer is released.
   */
  onPointerUp: VoidFunction
}

export function trackPointerMove(
  doc: Document,
  handlers: PointerMoveHandlers,
): VoidFunction {
  const {onPointerMove, onPointerUp} = handlers

  const handleMove = (event: PointerEvent) => {
    const point = getEventPoint(event)

    const distance = Math.sqrt(point.x ** 2 + point.y ** 2)
    const moveBuffer = event.pointerType === "touch" ? 10 : 5

    if (distance < moveBuffer) {
      return
    }

    // Because Safari doesn't trigger mouseup events when it's above a `<select>`
    if (event.pointerType === "mouse" && event.button === 0) {
      onPointerUp()
      return
    }

    onPointerMove({event, point})
  }

  const cleanups = [
    addDomEvent(doc, "pointermove", handleMove, false),
    addDomEvent(doc, "pointerup", onPointerUp, false),
    addDomEvent(doc, "pointercancel", onPointerUp, false),
    addDomEvent(doc, "contextmenu", onPointerUp, false),
    disableTextSelection({doc}),
  ]

  return (): void => {
    cleanups.forEach((cleanup) => cleanup())
  }
}
