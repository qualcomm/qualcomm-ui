// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {
  createQdsCardApi,
  type QdsCardApiProps,
} from "@qualcomm-ui/qds-core/card"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsCardContextProvider} from "./qds-card-context"

export interface CardRootProps
  extends QdsCardApiProps, Omit<ElementRenderProp<"div">, "dir"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The outer container for a card. Provides size and variant context to all child
 * card parts. Renders a `<div>` element by default.
 */
export function CardRoot({
  alignment,
  children,
  dir,
  interactive,
  size,
  variant,
  ...props
}: CardRootProps): ReactElement {
  const qdsCardApi = useMemo(
    () =>
      createQdsCardApi(
        {alignment, dir, interactive, size, variant},
        normalizeProps,
      ),
    [alignment, dir, interactive, size, variant],
  )
  const mergedProps = mergeProps(qdsCardApi.getRootBindings(), props)

  return (
    <QdsCardContextProvider value={qdsCardApi}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </QdsCardContextProvider>
  )
}
