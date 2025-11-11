// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ElementType, ReactElement} from "react"

import {PolymorphicAsElement} from "./polymorphic-as-element"
import type {ElementRenderProp} from "./system.types"
import {bindingRenderProp} from "./system.utils"

/**
 * @interface
 */
export type PolymorphicElementProps<
  DefaultTagName extends ElementType,
  Props extends object,
> = ElementRenderProp<DefaultTagName, Props> & {
  /**
   * The fallback element to render if no render prop is provided.
   */
  as?: DefaultTagName
}

export function PolymorphicElement<DefaultTagName extends ElementType>({
  as = "div",
  render,
  ...props
}: PolymorphicElementProps<DefaultTagName, any>): ReactElement {
  if (render) {
    return bindingRenderProp(render, props)
  }

  return <PolymorphicAsElement as={as} {...props} />
}
