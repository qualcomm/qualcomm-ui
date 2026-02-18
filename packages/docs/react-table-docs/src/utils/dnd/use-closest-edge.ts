// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useCallback, useState} from "react"

import type {DragMoveEvent} from "@dnd-kit/core"

export type VerticalEdge = "top" | "bottom"
export type HorizontalEdge = "left" | "right"

type Edge<T extends "horizontal" | "vertical"> = T extends "horizontal"
  ? HorizontalEdge
  : VerticalEdge

export function useClosestEdge<T extends "horizontal" | "vertical">(
  direction: T,
) {
  const [closestEdge, setClosestEdge] = useState<Edge<T> | undefined>()

  const calculateEdge = useCallback(
    (active: DragMoveEvent["active"], over: DragMoveEvent["over"]) => {
      if (!over) {
        setClosestEdge(undefined)
        return
      }

      const activeRect =
        active.rect.current.translated ?? active.rect.current.initial
      if (!activeRect) {
        return
      }

      if (direction === "horizontal") {
        const activeCenterX = activeRect.left + activeRect.width / 2
        const overCenterX = over.rect.left + over.rect.width / 2
        setClosestEdge(
          (activeCenterX < overCenterX ? "left" : "right") as Edge<T>,
        )
      } else {
        const activeCenterY = activeRect.top + activeRect.height / 2
        const overCenterY = over.rect.top + over.rect.height / 2
        setClosestEdge(
          (activeCenterY < overCenterY ? "top" : "bottom") as Edge<T>,
        )
      }
    },
    [direction],
  )

  const reset = useCallback(() => setClosestEdge(undefined), [])

  return {calculateEdge, closestEdge, reset}
}
