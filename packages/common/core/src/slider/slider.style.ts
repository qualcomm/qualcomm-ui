// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {JSX, Params} from "@qualcomm-ui/utils/machine"
import {
  getValuePercent,
  getValueTransformer,
  toPx,
} from "@qualcomm-ui/utils/number"

import type {SliderSchema} from "./slider.types"

type Ctx = Params<SliderSchema>

/** Range style calculations */

function getBounds<T>(value: T[]): [T, T] {
  const firstValue = value[0]
  const lastThumb = value[value.length - 1]
  return [firstValue, lastThumb]
}

export function getRangeOffsets(params: Pick<Ctx, "prop" | "computed">): {
  end: string
  start: string
} {
  const {computed, prop} = params
  const valuePercent = computed("valuePercent")
  const [firstPercent, lastPercent] = getBounds(valuePercent)

  if (valuePercent.length === 1) {
    if (prop("origin") === "center") {
      const isNegative = valuePercent[0] < 50
      const start = isNegative ? `${valuePercent[0]}%` : "50%"
      const end = isNegative ? "50%" : `${100 - valuePercent[0]}%`
      return {end, start}
    }
    if (prop("origin") === "end") {
      return {end: "0%", start: `${lastPercent}%`}
    }

    return {end: `${100 - lastPercent}%`, start: "0%"}
  }

  return {end: `${100 - lastPercent}%`, start: `${firstPercent}%`}
}

export function getRangeStyle(
  params: Pick<Ctx, "computed">,
): JSX.CSSProperties {
  const {computed} = params
  const isVertical = computed("isVertical")
  const isRtl = computed("isRtl")

  if (isVertical) {
    return {
      bottom: "var(--slider-range-start)",
      position: "absolute",
      top: "var(--slider-range-end)",
    }
  }
  return {
    [isRtl ? "left" : "right"]: "var(--slider-range-end)",
    [isRtl ? "right" : "left"]: "var(--slider-range-start)",
    position: "absolute",
  }
}

/** Thumb style calculations */

function getVerticalThumbOffset(
  params: Pick<Ctx, "context" | "prop">,
  value: number,
) {
  const {context, prop} = params
  const {height = 0} = context.get("thumbSize") ?? {}
  const getValue = getValueTransformer(
    [prop("min"), prop("max")],
    [-height / 2, height / 2],
  )
  return parseFloat(getValue(value).toFixed(2))
}

function getHorizontalThumbOffset(
  params: Pick<Ctx, "computed" | "context" | "prop">,
  value: number,
) {
  const {computed, context, prop} = params
  const {width = 0} = context.get("thumbSize") ?? {}

  const isRtl = computed("isRtl")

  if (isRtl) {
    const getValue = getValueTransformer(
      [prop("max"), prop("min")],
      [-width / 2, width / 2],
    )
    return -1 * parseFloat(getValue(value).toFixed(2))
  }

  const getValue = getValueTransformer(
    [prop("min"), prop("max")],
    [-width / 2, width / 2],
  )
  return parseFloat(getValue(value).toFixed(2))
}

function getOffset(
  params: Pick<Ctx, "computed" | "context" | "prop">,
  percent: number,
  value: number,
) {
  const {computed, prop} = params
  if (prop("thumbAlignment") === "center") {
    return `${percent}%`
  }
  const offset = computed("isVertical")
    ? getVerticalThumbOffset(params, value)
    : getHorizontalThumbOffset(params, value)
  return `calc(${percent}% - ${offset}px)`
}

export function getThumbOffset(
  params: Pick<Ctx, "computed" | "context" | "prop">,
  value: number,
): string {
  const {prop} = params
  const percent = getValuePercent(value, prop("min"), prop("max")) * 100
  return getOffset(params, percent, value)
}

export function getVisibility(
  params: Pick<Ctx, "computed" | "prop">,
): "visible" | "hidden" {
  const {computed, prop} = params
  let visibility: "visible" | "hidden" = "visible"
  if (
    prop("thumbAlignment") === "contain" &&
    !computed("hasMeasuredThumbSize")
  ) {
    visibility = "hidden"
  }
  return visibility
}

export function getThumbStyle(
  params: Pick<Ctx, "computed" | "prop">,
  index: number,
): JSX.CSSProperties {
  const {computed} = params
  const placementProp = computed("isVertical") ? "bottom" : "insetInlineStart"
  return {
    [placementProp]: `var(--slider-thumb-offset-${index})`,
    position: "absolute",
    transform: "var(--slider-thumb-transform)",
    visibility: getVisibility(params),
  }
}

/** Control style calculations */

export function getControlStyle(): JSX.CSSProperties {
  return {
    position: "relative",
    touchAction: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
  }
}

/** Root style calculations */

export function getRootStyle(
  params: Pick<Ctx, "context" | "computed" | "prop">,
): JSX.CSSProperties {
  const {computed, context} = params
  const isVertical = computed("isVertical")
  const isRtl = computed("isRtl")
  const range = getRangeOffsets(params)
  const thumbSize = context.get("thumbSize")

  const styles: JSX.CSSProperties = {
    "--slider-range-end": range.end,
    "--slider-range-start": range.start,
    "--slider-thumb-height": toPx(thumbSize?.height),
    "--slider-thumb-transform": isVertical
      ? "translateY(50%)"
      : isRtl
        ? "translateX(50%)"
        : "translateX(-50%)",
    "--slider-thumb-width": toPx(thumbSize?.width),
  }

  const values = context.get("value")
  for (let i = 0; i < values.length; i++) {
    styles[`--slider-thumb-offset-${i}`] = getThumbOffset(params, values[i])
  }

  return styles
}

/** Marker style calculations */

export function getMarkerStyle(
  params: Pick<Ctx, "computed" | "context" | "prop">,
  value: number,
): JSX.CSSProperties {
  const {computed} = params
  const isHorizontal = computed("isHorizontal")
  const isRtl = computed("isRtl")
  return {
    "--tx": isHorizontal ? (isRtl ? "50%" : "-50%") : "0%",
    "--ty": !isHorizontal ? "50%" : "0%",
    [isHorizontal ? "insetInlineStart" : "bottom"]: getThumbOffset(
      params,
      value,
    ),
    pointerEvents: "none",
    position: "absolute",
    translate: "var(--tx) var(--ty)",
    visibility: getVisibility(params),
  }
}

/** Label style calculations */

export function getMarkerGroupStyle(): JSX.CSSProperties {
  return {
    pointerEvents: "none",
    position: "relative",
    userSelect: "none",
    WebkitUserSelect: "none",
  }
}
