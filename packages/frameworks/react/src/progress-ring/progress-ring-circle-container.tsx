// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsProgressRingContext} from "./qds-progress-ring-context"

export interface ProgressRingCircleContainerProps
  extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Container element that wraps the circle and value text. Renders a `<div>` element
 * by default.
 */
export function ProgressRingCircleContainer({
  children,
  ...props
}: ProgressRingCircleContainerProps): ReactElement {
  const qdsContext = useQdsProgressRingContext()

  const mergedProps = mergeProps(qdsContext.getCircleContainerBindings(), props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
