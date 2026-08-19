// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsListItemContext} from "./qds-list-item-context.js"

export interface ListItemControlProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A leading control, such as a checkbox or radio button. Renders a `<div>`
 * element by default.
 */
export function ListItemControl({
  children,
  ...props
}: ListItemControlProps): ReactElement {
  const qdsContext = useQdsListItemContext()
  const mergedProps = mergeProps(qdsContext.getControlBindings(), props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
