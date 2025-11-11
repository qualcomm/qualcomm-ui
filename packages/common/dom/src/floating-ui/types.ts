// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  Boundary,
  ComputePositionReturn,
  VirtualElement,
} from "@floating-ui/dom"

export type MaybeRectElement = HTMLElement | VirtualElement | null

export type MaybeElement = HTMLElement | null

export type MaybeFn<T> = T | (() => T)

export type PlacementSide = "top" | "right" | "bottom" | "left"
export type PlacementAlign = "start" | "center" | "end"
export type PlacementStrategy = "absolute" | "fixed"

export type Placement =
  | "bottom"
  | "bottom-end"
  | "bottom-start"
  | "left"
  | "left-end"
  | "left-start"
  | "right"
  | "right-end"
  | "right-start"
  | "top"
  | "top-end"
  | "top-start"

export type TransformPoint = Placement

export interface AnchorRect {
  height?: number | undefined
  width?: number | undefined
  x?: number | undefined
  y?: number | undefined
}

export interface PositioningRect {
  height: number
  width: number
  x: number
  y: number
}

export type PositioningBoundary =
  | "clippingAncestors"
  | Element
  | Array<Element>
  | PositioningRect

export interface AutoUpdateOptions {
  /**
   * Whether to update the position when an overflow ancestor is resized. This
   * uses the native `resize` event.
   * @default true
   */
  ancestorResize?: boolean
  /**
   * Whether to update the position when an overflow ancestor is scrolled.
   * @default true
   */
  ancestorScroll?: boolean
  /**
   * Whether to update on every animation frame if necessary. Only use if you
   * need to update the position in response to an animation using transforms.
   * @default false
   */
  animationFrame?: boolean
  /**
   * Whether to update the position when either the reference or floating
   * elements resized. This uses a `ResizeObserver`.
   * @default true
   */
  elementResize?: boolean
  /**
   * Whether to update the position when the reference relocated on the screen
   * due to layout shift.
   * @default true
   */
  layoutShift?: boolean
}

export interface PositioningOptions {
  /**
   * The minimum padding between the arrow and the floating element's corner.
   * @default 4
   */
  arrowPadding?: number | undefined

  /**
   * The overflow boundary of the reference element
   */
  boundary?: (() => PositioningBoundary) | undefined

  /**
   * Whether the popover should fit the viewport.
   */
  fitViewport?: boolean | undefined

  /**
   * Whether to flip the placement when the floating element overflows the boundary.
   * @default true
   */
  flip?: boolean | Placement[] | undefined

  /**
   *  Function that returns the anchor rect
   */
  getAnchorRect?:
    | ((element: HTMLElement | VirtualElement | null) => AnchorRect | null)
    | undefined

  /**
   * The main axis offset or gap between the reference and floating element
   *
   * @default 8
   */
  gutter?: number | undefined

  /**
   * Whether the popover should be hidden when the reference element is detached
   */
  hideWhenDetached?: boolean | undefined

  /**
   * Options to activate auto-update listeners
   *
   * @default true
   */
  listeners?: boolean | AutoUpdateOptions | undefined

  /**
   * The offset of the floating element
   */
  offset?: {crossAxis?: number; mainAxis?: number} | undefined

  /**
   * Function called when the placement is computed
   */
  onComplete?: ((data: ComputePositionReturn) => void) | undefined

  /**
   * Function called when the floating element is positioned or not
   */
  onPositioned?: ((data: {placed: boolean}) => void) | undefined

  /**
   * The virtual padding around the viewport edges to check for overflow
   */
  overflowPadding?: number | undefined

  /**
   * Whether the floating element can overlap the reference element
   * @default false
   */
  overlap?: boolean | undefined

  /**
   * The initial placement of the floating element
   * @default 'bottom'
   */
  placement?: Placement | undefined

  /**
   * Whether to make the floating element same width as the reference element
   */
  sameWidth?: boolean | undefined

  /**
   * The secondary axis offset or gap between the reference and floating elements
   */
  shift?: number | undefined

  /**
   * Whether the popover should slide when it overflows.
   */
  slide?: boolean | undefined

  /**
   * The strategy to use for positioning
   * @default 'absolute'
   */
  strategy?: PlacementStrategy | undefined

  /**
   * A callback that will be called when the popover needs to calculate its
   * position.
   */
  updatePosition?:
    | ((data: {updatePosition: () => Promise<void>}) => void | Promise<void>)
    | undefined
}

export type {Boundary, ComputePositionReturn}
