// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Coords, Middleware} from "@floating-ui/dom"

import type {PlacementSide, TransformPoint} from "./types"

/* -----------------------------------------------------------------------------
 * Shared middleware utils
 * ----------------------------------------------------------------------------- */

interface CssVar {
  /**
   * The variable as it is referenced in CSS.
   *
   * @example `var(--arrow-background)`
   */
  reference: string

  /**
   * The string variable name without the enclosing `var()`.
   *
   * @example `--arrow-background`
   */
  variable: string
}

function toVar(value: string, fallbackValue?: string): CssVar {
  return {
    reference: fallbackValue
      ? `var(${value}, var(${fallbackValue}))`
      : `var(${value})`,
    variable: value,
  }
}

export const cssVars: Record<
  | "arrowBg"
  | "arrowOffset"
  | "arrowSize"
  | "arrowHeight"
  | "arrowWidth"
  | "arrowSizeHalf"
  | "referenceWidth"
  | "transformOrigin",
  CssVar
> = {
  arrowBg: toVar("--arrow-background"),
  arrowHeight: toVar("--arrow-height", "--arrow-size"),
  arrowOffset: toVar("--arrow-offset"),
  arrowSize: toVar("--arrow-size"),
  arrowSizeHalf: toVar("--arrow-size-half"),
  arrowWidth: toVar("--arrow-width", "--arrow-size"),
  referenceWidth: toVar("--reference-width"),
  transformOrigin: toVar("--transform-origin"),
} as const

/* -----------------------------------------------------------------------------
 * Transform Origin Middleware
 * ----------------------------------------------------------------------------- */

function getTransformOrigin(
  arrow?: Partial<Coords>,
): Record<TransformPoint, string> {
  return {
    bottom: "top center",
    "bottom-end": arrow ? `${arrow.x}px top` : "top right",
    "bottom-start": arrow ? `${arrow.x}px top` : "top left",
    left: "right center",
    "left-end": arrow ? `right ${arrow.y}px` : "right bottom",
    "left-start": arrow ? `right ${arrow.y}px` : "right top",
    right: "left center",
    "right-end": arrow ? `left ${arrow.y}px` : "left bottom",
    "right-start": arrow ? `left ${arrow.y}px` : "left top",
    top: "bottom center",
    "top-end": arrow ? `${arrow.x}px bottom` : "right bottom",
    "top-start": arrow ? `${arrow.x}px bottom` : "left bottom",
  }
}

export const transformOriginMiddleware: Middleware = {
  fn({elements, middlewareData, placement}) {
    const {arrow} = middlewareData
    const transformOrigin = getTransformOrigin(arrow)[placement]

    const {floating} = elements
    floating.style.setProperty(
      cssVars.transformOrigin.variable,
      transformOrigin,
    )

    return {
      data: {transformOrigin},
    }
  },
  name: "transformOrigin",
}

/* -----------------------------------------------------------------------------
 * Rect Middleware (to expose the rect data)
 * ----------------------------------------------------------------------------- */

export const rectMiddleware: Middleware = {
  fn({rects}) {
    return {
      data: rects,
    }
  },
  name: "rects",
} as const

/* -----------------------------------------------------------------------------
 * Arrow Middleware
 * ----------------------------------------------------------------------------- */

export function shiftArrowMiddleware(
  arrowEl: HTMLElement | null,
): Middleware | undefined {
  if (!arrowEl) {
    return
  }
  return {
    fn({middlewareData, placement}) {
      if (!middlewareData.arrow) {
        return {}
      }
      const {x, y} = middlewareData.arrow
      const dir = placement.split("-")[0] as PlacementSide

      Object.assign(arrowEl.style, {
        left: x != null ? `${x}px` : "",
        top: y != null ? `${y}px` : "",
        // order matters here.
        ...{},
        [dir]: `calc(100% + ${cssVars.arrowOffset.reference})`,
      })

      return {}
    },
    name: "shiftArrow",
  }
}
