// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react"

import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import type {BindingRenderProp, RenderProp} from "./system.types"

interface BindingRenderPropConfig {
  /**
   * @default true
   */
  forwardPropsToClone?: boolean

  /**
   * @default true
   */
  mergeElementProps?: true
}

/**
 * Accepts either a ReactElement or a function that returns a ReactElement. If
 * ReactElement, the element is cloned and props are forwarded (unless {@link
 * forwardPropsToClone} is false). If function, the function is called with the
 * props as the argument. Makes for a flexible render prop.
 */
export function bindingRenderProp<
  P extends NonNullable<unknown> = HTMLAttributes<HTMLElement>,
>(
  render: BindingRenderProp<P>,
  computedProps: P,
  opts: BindingRenderPropConfig = {},
): ReactElement {
  if (typeof render === "function") {
    return render(computedProps)
  } else if (typeof render === "string" || typeof render === "number") {
    return <>{render}</>
  }
  const {forwardPropsToClone = true, mergeElementProps = true} = opts
  const props = forwardPropsToClone ? computedProps : {}
  const mergedProps =
    mergeElementProps && isValidElement(render)
      ? mergeProps(render.props as NonNullable<unknown>, props)
      : props
  return cloneElement(render, mergedProps)
}

/**
 * @deprecated migrate to {@link renderProp}
 */
export function renderNodeOrFunc<
  P extends NonNullable<unknown> = HTMLAttributes<HTMLElement>,
>(render: RenderProp<P>, computedProps: P): ReactNode {
  return renderProp(render, computedProps)
}

/**
 * Accepts either a ReactNode or a function that returns a ReactNode. If ReactNode,
 * the element is returned as-is. If function, the function is called with the
 * associated parameters.
 */
export function renderProp<
  P extends NonNullable<unknown> = HTMLAttributes<HTMLElement>,
>(render: RenderProp<P>, computedProps: P): ReactNode {
  if (typeof render === "function") {
    return render(computedProps)
  }
  return render
}
