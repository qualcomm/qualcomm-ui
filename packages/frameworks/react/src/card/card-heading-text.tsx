// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsCardContext} from "./qds-card-context.js"

export interface CardHeadingTextProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The primary heading of the card. Renders a `<div>` element by default.
 */
export function CardHeadingText(props: CardHeadingTextProps): ReactElement {
  const qdsContext = useQdsCardContext()
  const mergedProps = mergeProps(qdsContext.getHeadingTextBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}
