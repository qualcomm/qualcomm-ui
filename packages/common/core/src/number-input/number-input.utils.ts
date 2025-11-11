// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NumberParser} from "@internationalized/number"

import type {Params} from "@qualcomm-ui/utils/machine"

import type {NumberInputSchema} from "./number-input.types"

export function createFormatter(
  locale: string,
  options: Intl.NumberFormatOptions = {},
): Intl.NumberFormat {
  return new Intl.NumberFormat(locale, options)
}

export function createParser(
  locale: string,
  options: Intl.NumberFormatOptions = {},
): NumberParser {
  return new NumberParser(locale, options)
}

type Ctx = Pick<Params<NumberInputSchema>, "prop" | "computed">

export function parseValue(value: string | number, params: Ctx): any {
  const {computed, prop} = params
  if (!prop("formatOptions")) {
    return parseFloat(value as string)
  }
  if (value === "") {
    return Number.NaN
  }
  return computed("parser").parse(value as string)
}

export function formatValue(value: number, params: Ctx): string {
  const {computed, prop} = params
  if (Number.isNaN(value)) {
    return ""
  }
  if (!prop("formatOptions")) {
    return value.toString()
  }
  return computed("formatter").format(value)
}

export function getDefaultStep(
  step: number | undefined,
  formatOptions: Intl.NumberFormatOptions | undefined,
): number {
  let defaultStep = step !== undefined && !Number.isNaN(step) ? step : 1
  if (
    formatOptions?.style === "percent" &&
    (step === undefined || Number.isNaN(step))
  ) {
    defaultStep = 0.01
  }
  return defaultStep
}
