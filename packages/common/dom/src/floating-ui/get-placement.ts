// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  arrow,
  autoUpdate,
  type AutoUpdateOptions,
  computePosition,
  flip,
  hide,
  limitShift,
  type Middleware,
  offset,
  type Placement,
  shift,
  size,
} from "@floating-ui/dom"

import {getWindow, raf} from "@qualcomm-ui/dom/query"
import {noop, runIfFn} from "@qualcomm-ui/utils/functions"
import {isNull} from "@qualcomm-ui/utils/guard"
import {compact} from "@qualcomm-ui/utils/object"

import {getAnchorElement} from "./get-anchor"
import {
  rectMiddleware,
  shiftArrowMiddleware,
  transformOriginMiddleware,
} from "./middleware"
import {getPlacementDetails} from "./placement"
import type {
  MaybeElement,
  MaybeFn,
  MaybeRectElement,
  PositioningOptions,
} from "./types"

const defaultOptions: PositioningOptions = {
  arrowPadding: 4,
  fitViewport: false,
  flip: true,
  gutter: 8,
  listeners: true,
  overflowPadding: 8,
  overlap: false,
  placement: "bottom",
  sameWidth: false,
  slide: true,
  strategy: "absolute",
}

type NonNullable<T> = T extends null | undefined ? never : T
type RequiredBy<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
}

interface Options
  extends RequiredBy<
    PositioningOptions,
    | "strategy"
    | "placement"
    | "listeners"
    | "gutter"
    | "flip"
    | "slide"
    | "overlap"
    | "sameWidth"
    | "fitViewport"
    | "overflowPadding"
    | "arrowPadding"
  > {}

function roundByDpr(win: Window, value: number) {
  const dpr = win.devicePixelRatio || 1
  return Math.round(value * dpr) / dpr
}

function getBoundaryMiddleware(opts: Options) {
  return runIfFn(opts.boundary)
}

function getArrowMiddleware(arrowElement: HTMLElement | null, opts: Options) {
  if (!arrowElement) {
    return
  }
  return arrow({
    element: arrowElement,
    padding: opts.arrowPadding,
  })
}

function getOffsetMiddleware(arrowElement: HTMLElement | null, opts: Options) {
  if (isNull(opts.offset ?? opts.gutter)) {
    return
  }
  return offset(({placement}) => {
    const arrowOffset = (arrowElement?.clientHeight || 0) / 2

    const gutter = opts.offset?.mainAxis ?? opts.gutter
    const mainAxis =
      typeof gutter === "number"
        ? gutter + arrowOffset
        : (gutter ?? arrowOffset)

    const {hasAlign} = getPlacementDetails(placement)
    const shift = !hasAlign ? opts.shift : undefined
    const crossAxis = opts.offset?.crossAxis ?? shift

    return compact({
      alignmentAxis: opts.shift,
      crossAxis,
      mainAxis,
    })
  })
}

function getFlipMiddleware(opts: Options) {
  if (!opts.flip) {
    return
  }
  return flip({
    boundary: getBoundaryMiddleware(opts),
    fallbackPlacements: (opts.flip === true
      ? undefined
      : opts.flip) as Placement[],
    padding: opts.overflowPadding,
  })
}

function getShiftMiddleware(opts: Options) {
  if (!opts.slide && !opts.overlap) {
    return
  }
  return shift({
    boundary: getBoundaryMiddleware(opts),
    crossAxis: opts.overlap,
    limiter: limitShift(),
    mainAxis: opts.slide,
    padding: opts.overflowPadding,
  })
}

function getSizeMiddleware(opts: Options) {
  return size({
    apply({availableHeight, availableWidth, elements, rects}) {
      const floating = elements.floating

      const referenceWidth = Math.round(rects.reference.width)
      availableWidth = Math.floor(availableWidth)
      availableHeight = Math.floor(availableHeight)

      floating.style.setProperty("--reference-width", `${referenceWidth}px`)
      floating.style.setProperty("--available-width", `${availableWidth}px`)
      floating.style.setProperty("--available-height", `${availableHeight}px`)
    },
    padding: opts.overflowPadding,
  })
}

function hideWhenDetachedMiddleware(opts: Options) {
  if (!opts.hideWhenDetached) {
    return
  }
  return hide({
    boundary: opts.boundary?.() ?? "clippingAncestors",
    strategy: "referenceHidden",
  })
}

function getAutoUpdateOptions(
  opts?: boolean | AutoUpdateOptions,
): AutoUpdateOptions {
  if (!opts) {
    return {}
  }
  if (opts === true) {
    return {
      ancestorResize: true,
      ancestorScroll: true,
      elementResize: true,
      layoutShift: true,
    }
  }
  return opts
}

function getPlacementImpl(
  referenceOrVirtual: MaybeRectElement,
  floating: MaybeElement,
  opts: PositioningOptions = {},
) {
  const reference = getAnchorElement(referenceOrVirtual, opts.getAnchorRect)
  if (!floating || !reference) {
    return
  }
  const options = Object.assign({}, defaultOptions, opts) as Options

  /* -----------------------------------------------------------------------------
   * The middleware stack
   * ----------------------------------------------------------------------------- */

  const arrowEl = floating.querySelector<HTMLElement>("[data-part=arrow]")

  const middleware: (Middleware | undefined)[] = [
    getOffsetMiddleware(arrowEl, options),
    getFlipMiddleware(options),
    getShiftMiddleware(options),
    getArrowMiddleware(arrowEl, options),
    shiftArrowMiddleware(arrowEl),
    transformOriginMiddleware,
    getSizeMiddleware(options),
    hideWhenDetachedMiddleware(options),
    rectMiddleware,
  ]

  /* -----------------------------------------------------------------------------
   * The actual positioning function
   * ----------------------------------------------------------------------------- */

  const {onComplete, onPositioned, placement, strategy} = options

  const updatePosition = async () => {
    if (!reference || !floating) {
      return
    }

    const pos = await computePosition(reference, floating, {
      middleware,
      placement,
      strategy,
    })

    onComplete?.(pos)
    onPositioned?.({placed: true})

    const win = getWindow(floating)
    const x = roundByDpr(win, pos.x)
    const y = roundByDpr(win, pos.y)

    floating.style.setProperty("--x", `${x}px`)
    floating.style.setProperty("--y", `${y}px`)

    if (options.hideWhenDetached) {
      const isHidden = pos.middlewareData.hide?.referenceHidden
      if (isHidden) {
        floating.style.setProperty("visibility", "hidden")
        floating.style.setProperty("pointer-events", "none")
      } else {
        floating.style.removeProperty("visibility")
        floating.style.removeProperty("pointer-events")
      }
    }

    const contentEl = floating.firstElementChild

    if (contentEl) {
      const styles = getComputedStyle(contentEl)
      floating.style.setProperty("--z-index", styles.zIndex)
    }
  }

  const update = async () => {
    if (opts.updatePosition) {
      await opts.updatePosition({updatePosition})
      onPositioned?.({placed: true})
    } else {
      await updatePosition()
    }
  }

  const autoUpdateOptions = getAutoUpdateOptions(options.listeners)
  const cancelAutoUpdate = options.listeners
    ? autoUpdate(reference, floating, update, autoUpdateOptions)
    : noop

  void update()

  return () => {
    cancelAutoUpdate?.()
    onPositioned?.({placed: false})
  }
}

/**
 * Calculates and applies the placement of a floating element relative to a
 * reference element based on the provided options.
 */
export function getPlacement(
  referenceOrFn: MaybeFn<MaybeRectElement>,
  floatingOrFn: MaybeFn<MaybeElement>,
  opts: PositioningOptions & {defer?: boolean} = {},
): VoidFunction {
  const {defer, ...options} = opts
  const func = defer ? raf : (v: any) => v()
  const cleanups: (VoidFunction | undefined)[] = []
  cleanups.push(
    func(() => {
      const reference =
        typeof referenceOrFn === "function" ? referenceOrFn() : referenceOrFn
      const floating =
        typeof floatingOrFn === "function" ? floatingOrFn() : floatingOrFn
      cleanups.push(getPlacementImpl(reference, floating, options))
    }),
  )
  return () => {
    cleanups.forEach((fn) => fn?.())
  }
}
