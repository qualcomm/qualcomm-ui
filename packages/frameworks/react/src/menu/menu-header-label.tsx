// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsMenuContext} from "./qds-menu-context.js"

export interface MenuHeaderLabelProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The menu header text. Renders a `<div>` element by default.
 */
export function MenuHeaderLabel(props: MenuHeaderLabelProps): ReactElement {
  const qdsContext = useQdsMenuContext()
  const mergedProps = mergeProps(qdsContext.getHeaderLabelBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}
