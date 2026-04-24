// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {QdsCardMediaApiProps} from "@qualcomm-ui/qds-core/card"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsCardContext} from "./qds-card-context"

export interface CardMediaProps
  extends ElementRenderProp<"div">, QdsCardMediaApiProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A media area at the top of the card for images, avatars, or other visual content.
 * Renders a `<div>` element by default.
 */
export function CardMedia({padding, ...props}: CardMediaProps): ReactElement {
  const qdsContext = useQdsCardContext()
  const mergedProps = mergeProps(qdsContext.getMediaBindings({padding}), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}
