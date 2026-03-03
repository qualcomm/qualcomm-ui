// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFieldGroupContext} from "./qds-field-group-context"

export interface FieldGroupHintProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Hint text for the field group. Renders a `<div>` element by default.
 */
export function FieldGroupHint({
  children,
  ...props
}: FieldGroupHintProps): ReactElement {
  const qdsContext = useQdsFieldGroupContext()
  const mergedProps = mergeProps(qdsContext.getHintBindings(), props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
