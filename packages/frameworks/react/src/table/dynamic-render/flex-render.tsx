// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentType, ReactNode} from "react"

export type Renderable<TProps> = ReactNode | ComponentType<TProps>

/**
 * If rendering headers, cells, or footers with custom markup, use flexRender
 * instead of `cell.getValue()` or `cell.renderValue()`.
 */
export function flexRender<TProps extends object>(
  Comp: Renderable<TProps>,
  props: TProps,
): ReactNode {
  return !Comp ? null : isReactComponent<TProps>(Comp) ? (
    <Comp {...props} />
  ) : (
    Comp
  )
}

function isReactComponent<TProps>(
  component: unknown,
): component is ComponentType<TProps> {
  return (
    isClassComponent(component) ||
    typeof component === "function" ||
    isExoticComponent(component)
  )
}

function isClassComponent(component: any) {
  return (
    typeof component === "function" &&
    (() => {
      const proto = Object.getPrototypeOf(component)
      return proto.prototype && proto.prototype.isReactComponent
    })()
  )
}

function isExoticComponent(component: any) {
  return (
    typeof component === "object" &&
    typeof component.$$typeof === "symbol" &&
    ["react.memo", "react.forward_ref"].includes(component.$$typeof.description)
  )
}
