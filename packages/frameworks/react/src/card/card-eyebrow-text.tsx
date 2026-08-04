// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsCardContext} from "./qds-card-context.js"

export interface CardEyebrowTextProps extends ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A small label above the heading, typically used for categorization.
 * Renders a `<span>` element by default.
 */
export function CardEyebrowText(props: CardEyebrowTextProps): ReactElement {
  const qdsContext = useQdsCardContext()
  const mergedProps = mergeProps(qdsContext.getEyebrowTextBindings(), props)

  return <PolymorphicElement as="span" {...mergedProps} />
}
