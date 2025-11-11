// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Placement} from "@floating-ui/dom"

import {cssVars} from "./middleware"
import type {PlacementSide, PositioningOptions} from "./types"

export interface GetPlacementStylesOptions {
  placement?: Placement | undefined
}

const ARROW_FLOATING_STYLE: Record<PlacementSide, string> = {
  bottom: "rotate(45deg)",
  left: "rotate(135deg)",
  right: "rotate(315deg)",
  top: "rotate(225deg)",
} as const

interface ArrowPlacementStyle {
  [p: string]: string
  height: string
  position: "absolute"
  width: string
}

interface ArrowTipPlacementStyle {
  background: string
  height: "100%"
  left: "0"
  position: "absolute"
  top: "0"
  transform: any
  width: "100%"
  zIndex: "inherit"
}

interface FloatingPlacementStyle {
  isolation: "isolate"
  left: "0px"
  maxHeight: "var(--available-height)" | undefined
  maxWidth: "var(--available-width)" | undefined
  minWidth: "max-content" | undefined
  pointerEvents: "none" | undefined
  position: "absolute" | "fixed"
  top: "0px"
  transform: "translate3d(var(--x), var(--y), 0)" | "translate3d(0, -100vh, 0)"
  width: "var(--reference-width)" | undefined
  zIndex: "var(--z-index)"
}

interface PlacementStyles {
  arrow: ArrowPlacementStyle
  arrowTip: ArrowTipPlacementStyle
  floating: FloatingPlacementStyle
}

export function getPlacementStyles(
  options: Pick<
    PositioningOptions,
    "placement" | "sameWidth" | "fitViewport" | "strategy"
  > = {},
): PlacementStyles {
  const {fitViewport, placement, sameWidth, strategy = "absolute"} = options

  return {
    arrow: {
      [cssVars.arrowOffset.variable]:
        `calc(${cssVars.arrowSizeHalf.reference} * -1)`,
      [cssVars.arrowSizeHalf.variable]:
        `calc(${cssVars.arrowSize.reference} / 2)`,
      height: cssVars.arrowHeight.reference,
      position: "absolute",
      width: cssVars.arrowWidth.reference,
    } as const,

    arrowTip: {
      background: cssVars.arrowBg.reference,
      height: "100%",
      left: "0",
      position: "absolute",
      top: "0",
      transform: placement
        ? ARROW_FLOATING_STYLE[placement.split("-")[0] as PlacementSide]
        : undefined,
      width: "100%",
      zIndex: "inherit",
    } as const,

    floating: {
      isolation: "isolate",
      left: "0px",
      maxHeight: fitViewport ? "var(--available-height)" : undefined,
      maxWidth: fitViewport ? "var(--available-width)" : undefined,
      minWidth: sameWidth ? undefined : "max-content",
      pointerEvents: !placement ? "none" : undefined,
      position: strategy,
      top: "0px",
      // move off-screen if placement is not defined
      transform: placement
        ? "translate3d(var(--x), var(--y), 0)"
        : "translate3d(0, -100vh, 0)",
      width: sameWidth ? "var(--reference-width)" : undefined,
      zIndex: "var(--z-index)",
    } as const,
  }
}
