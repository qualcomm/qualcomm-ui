// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {CSSProperties} from "react"

import type {AnimationEasing} from "@qualcomm-ui/utils/transitions"

/**
 * CSS hack to force a repaint
 */
export function reflow(node: Element): void {
  // We have to do something with node.scrollTop.
  // Otherwise it's removed from the compiled code by optimisers

  node.scrollTop = node.scrollTop
}

interface ComponentProps {
  easing: AnimationEasing
  style: CSSProperties | undefined
  timeout: number | "auto" | {enter?: number; exit?: number}
}

interface Options {
  mode: "enter" | "exit"
}

interface TransitionProps {
  delay: string | undefined
  duration: string | number
  easing: string | undefined
}

export function getTransitionProps(
  props: ComponentProps,
  options: Options,
): TransitionProps {
  const {easing, style = {}, timeout} = props

  return {
    delay: style.transitionDelay,
    duration:
      style.transitionDuration ??
      (typeof timeout === "number" || timeout === "auto"
        ? timeout
        : timeout[options.mode] || 0),
    easing:
      style.transitionTimingFunction ??
      (typeof easing === "object" ? easing[options.mode] : easing),
  }
}
