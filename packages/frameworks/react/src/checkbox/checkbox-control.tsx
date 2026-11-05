// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useCheckboxControl} from "@qualcomm-ui/react-core/checkbox"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import type {ComponentDataAttributes} from "@qualcomm-ui/utils/attributes"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {CheckboxIndicator} from "./checkbox-indicator.js"
import {useQdsCheckboxContext} from "./qds-checkbox-context.js"

export interface CheckboxControlProps
  extends IdProp, ElementRenderProp<"div">, ComponentDataAttributes {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   *
   * @default `<CheckboxIndicator />`
   */
  children?: ReactNode
}

/**
 * Visual control that wraps the checkbox indicator. Renders a `<div>` element by
 * default.
 */
export function CheckboxControl({
  children = <CheckboxIndicator />,
  id,
  ...props
}: CheckboxControlProps): ReactElement {
  const contextProps = useCheckboxControl({id})
  const qdsContext = useQdsCheckboxContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getControlBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
