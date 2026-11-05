// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {CheckmarkIcon} from "@qualcomm-ui/react/checkmark"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsRadioContext} from "./qds-radio-context.js"

export interface RadioCheckboxIndicatorProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   * Defaults to the check icon when the checkbox is checked.
   *
   * @default `<RadioCheckboxIndicatorIcon />`
   */
  children?: ReactNode
}

/**
 * Visual indicator that displays the checkbox state. Renders a `<div>` element by
 * default.
 */
export function RadioCheckboxIndicator({
  children,
  ...props
}: RadioCheckboxIndicatorProps): ReactElement {
  const qdsContext = useQdsRadioContext()
  const mergedProps = mergeProps(
    qdsContext.getItemCheckboxIndicatorBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children ?? (
        <CheckmarkIcon indeterminate={false} size={qdsContext.size} />
      )}
    </PolymorphicElement>
  )
}
