// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export type DragState =
  | {
      type: "idle"
    }
  | {
      type: "is-dragging"
    }
  | {container: HTMLElement; type: "preview"}
  | {
      closestEdge: any
      sourceIndex?: number
      type: "is-dragging-over"
    }
