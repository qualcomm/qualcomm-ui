// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {
  createQdsListItemApi,
  type QdsListItemApiProps,
} from "@qualcomm-ui/qds-core/list-item"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsListItemContextProvider} from "./qds-list-item-context.js"

export interface ListItemRootProps
  extends QdsListItemApiProps, ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Groups the parts of a list item. Renders an `<div>` element by default.
 */
export function ListItemRoot({
  children,
  disabled,
  interactive,
  size,
  ...props
}: ListItemRootProps): ReactElement {
  const qdsListItemApi = useMemo(
    () => createQdsListItemApi({disabled, interactive, size}, normalizeProps),
    [disabled, interactive, size],
  )
  const mergedProps = mergeProps(qdsListItemApi.getRootBindings(), props)

  return (
    <QdsListItemContextProvider value={qdsListItemApi}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </QdsListItemContextProvider>
  )
}
