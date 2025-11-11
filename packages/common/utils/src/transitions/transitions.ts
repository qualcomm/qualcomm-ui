// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {coerceNumberProperty} from "@qualcomm-ui/utils/coercion"

/**
 * The CSS transition-timing-function of the enter and exit animations.
 */
export type AnimationEasing =
  | string
  | {
      /**
       * transition-timing-function of the enter animation.
       */
      enter: string

      /**
       * transition-timing-function of the exit animation.
       */
      exit: string
    }

/**
 * Calculates animation duration based on size.
 */
export function getAutoHeightDuration(height: number): number {
  if (!height) {
    return 0
  }

  const constant = height / 36

  // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10)
}

interface CreateTransitionOptions {
  delay?: string | number
  duration: string | number
  easing?: string
}

const formatMs = (milliseconds: number) => `${Math.round(milliseconds)}ms`

export function createTransition(
  props: string | string[] = ["all"],
  options?: CreateTransitionOptions,
): string {
  const {
    delay = 0,
    duration = 300,
    easing = "cubic-bezier(0.4, 0, 0.2, 1)",
  } = options || {}

  const properties = Array.isArray(props) ? props : [props]

  return properties
    .map((animatedProp) => {
      const formattedDuration = formatMs(coerceNumberProperty(duration))
      const formattedDelay = formatMs(coerceNumberProperty(delay))
      return `${animatedProp} ${formattedDuration} ${easing} ${formattedDelay}`
    })
    .join(",")
}
