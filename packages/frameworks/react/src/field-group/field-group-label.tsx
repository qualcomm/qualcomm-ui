// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFieldGroupContext} from "./qds-field-group-context"

export interface FieldGroupLabelProps extends ElementRenderProp<"legend"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Label for the field group. Renders a `<legend>` element by default.
 */
export function FieldGroupLabel({
  children,
  ...props
}: FieldGroupLabelProps): ReactElement {
  const qdsContext = useQdsFieldGroupContext()
  const mergedProps = mergeProps(qdsContext.getLabelBindings(), props)

  return (
    <PolymorphicElement as="legend" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
