// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {CheckmarkIcon} from "@qualcomm-ui/react/checkmark"
import {useCheckboxIndicator} from "@qualcomm-ui/react-core/checkbox"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsCheckboxContext} from "./qds-checkbox-context"

export interface CheckboxIndicatorProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   * Defaults to the check icon when the checkbox is checked.
   *
   * @default `<CheckboxIndicatorIcon />`
   */
  children?: ReactNode
}

/**
 * Visual indicator that displays the checkbox state. Renders a `<div>` element by
 * default.
 */
export function CheckboxIndicator({
  children,
  ...props
}: CheckboxIndicatorProps): ReactElement {
  const {contextProps, indeterminate} = useCheckboxIndicator()
  const qdsContext = useQdsCheckboxContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getIndicatorBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children ?? (
        <CheckmarkIcon indeterminate={indeterminate} size={qdsContext.size} />
      )}
    </PolymorphicElement>
  )
}
