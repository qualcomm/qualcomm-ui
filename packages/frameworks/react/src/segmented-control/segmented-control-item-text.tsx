// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useCheckboxLabel} from "@qualcomm-ui/react-core/checkbox"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSegmentedControlContext} from "./qds-segmented-control-context.js"

export interface SegmentedControlItemTextProps
  extends ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A segmented control item's text. Renders as a `<span>` by default.
 */
export function SegmentedControlItemText({
  children,
  id,
  ...props
}: SegmentedControlItemTextProps): ReactElement {
  const context = useCheckboxLabel({id})
  const qdsContext = useQdsSegmentedControlContext()
  const mergedProps = mergeProps(
    context,
    qdsContext.getItemTextBindings(),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
