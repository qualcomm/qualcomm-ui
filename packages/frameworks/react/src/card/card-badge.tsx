// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsCardContext} from "./qds-card-context"

export interface CardBadgeProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A badge slot within the card, typically used to display a status or category
 * badge. Renders a `<div>` element by default.
 */
export function CardBadge(props: CardBadgeProps): ReactElement {
  const qdsContext = useQdsCardContext()
  const mergedProps = mergeProps(qdsContext.getBadgeBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}
