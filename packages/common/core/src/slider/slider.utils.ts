// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Params} from "@qualcomm-ui/utils/machine"
import {
  clampValue,
  getClosestValueIndex,
  getNextStepValue,
  getPreviousStepValue,
  getValueRanges,
  isValueWithinRange,
  snapValueToStep,
} from "@qualcomm-ui/utils/number"

import type {Size, SliderSchema} from "./slider.types"

type Ctx = Params<SliderSchema>

export function isEqualSize(a: Size | null, b: Size | null): boolean {
  return a?.width === b?.width && a?.height === b?.height
}

export const normalize = (
  value: number[],
  min: number,
  max: number,
  step: number,
  minStepsBetweenThumbs: number,
): number[] => {
  const ranges = getValueRanges(value, min, max, minStepsBetweenThumbs * step)
  return ranges.map((range) => {
    const snapValue = snapValueToStep(range.value, range.min, range.max, step)
    const rangeValue = clampValue(snapValue, range.min, range.max)
    if (!isValueWithinRange(rangeValue, min, max)) {
      throw new Error(
        "[@qualcomm-ui/core/slider] The configured `min`, `max`, `step` or `minStepsBetweenThumbs` values are invalid",
      )
    }
    return rangeValue
  })
}

export function normalizeValues(params: Ctx, nextValues: number[]): number[] {
  return nextValues.map((value, index) => {
    return constrainValue(params, value, index)
  })
}

export function getRangeAtIndex(
  params: Pick<Ctx, "context" | "prop">,
  index: number,
): {
  max: number
  min: number
} {
  const {context, prop} = params
  const step = prop("step") * prop("minStepsBetweenThumbs")
  return getValueRanges(context.get("value"), prop("min"), prop("max"), step)[
    index
  ]
}

export function constrainValue(
  params: Pick<Ctx, "context" | "prop">,
  value: number,
  index: number,
): number {
  const {prop} = params
  const range = getRangeAtIndex(params, index)
  const snapValue = snapValueToStep(
    value,
    prop("min"),
    prop("max"),
    prop("step"),
  )
  return clampValue(snapValue, range.min, range.max)
}

export function decrement(
  params: Pick<Ctx, "context" | "prop">,
  index?: number,
  step?: number,
): number[] {
  const {context, prop} = params
  const idx = index ?? context.get("focusedIndex")
  const range = getRangeAtIndex(params, idx)
  const nextValues = getPreviousStepValue(idx, {
    ...range,
    step: step ?? prop("step"),
    values: context.get("value"),
  })
  nextValues[idx] = clampValue(nextValues[idx], range.min, range.max)
  return nextValues
}

export function increment(
  params: Pick<Ctx, "context" | "prop">,
  index?: number,
  step?: number,
): number[] {
  const {context, prop} = params
  const idx = index ?? context.get("focusedIndex")
  const range = getRangeAtIndex(params, idx)
  const nextValues = getNextStepValue(idx, {
    ...range,
    step: step ?? prop("step"),
    values: context.get("value"),
  })
  nextValues[idx] = clampValue(nextValues[idx], range.min, range.max)
  return nextValues
}

export function getClosestIndex(
  params: Pick<Ctx, "context" | "prop">,
  pointValue: number,
): number {
  const {context} = params
  return getClosestValueIndex(context.get("value"), pointValue)
}

export function assignArray(current: number[], next: number[]): void {
  for (let i = 0; i < next.length; i++) {
    const value = next[i]
    current[i] = value
  }
}
