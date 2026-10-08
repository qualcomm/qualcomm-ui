// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {ButtonPropsContextProvider} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsMenuContext} from "./qds-menu-context.js"

export interface MenuHeaderProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The top section of the menu. Renders a `<div>` element by default.
 */
export function MenuHeader(props: MenuHeaderProps): ReactElement {
  const qdsContext = useQdsMenuContext()
  const mergedProps = mergeProps(qdsContext.getHeaderBindings(), props)

  return (
    <ButtonPropsContextProvider value={qdsContext.getHeaderButtonProps()}>
      <PolymorphicElement as="div" {...mergedProps} />
    </ButtonPropsContextProvider>
  )
}
