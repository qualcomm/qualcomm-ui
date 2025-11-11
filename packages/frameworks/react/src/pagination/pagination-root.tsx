// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {splitProps} from "@qualcomm-ui/core/pagination"
import {
  createQdsPaginationApi,
  type QdsPaginationApi,
  type QdsPaginationApiProps,
} from "@qualcomm-ui/qds-core/pagination"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  PaginationContextProvider,
  usePagination,
  type UsePaginationProps,
} from "@qualcomm-ui/react-core/pagination"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsPaginationContextProvider} from "./qds-pagination-context"

export interface PaginationRootProps
  extends UsePaginationProps,
    QdsPaginationApiProps,
    ElementRenderProp<"nav"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode
}

export function PaginationRoot({
  children,
  size,
  ...props
}: PaginationRootProps): ReactElement {
  const [paginationProps, localProps] = splitProps<UsePaginationProps>(props)
  const api = usePagination(paginationProps)

  const qdsContext: QdsPaginationApi = useMemo(
    () =>
      createQdsPaginationApi(
        {
          size,
        },
        normalizeProps,
      ),
    [size],
  )

  const mergedProps = mergeProps(
    api.getRootBindings(),
    qdsContext.getRootBindings(),
    localProps,
  )

  return (
    <QdsPaginationContextProvider value={qdsContext}>
      <PaginationContextProvider value={api}>
        <PolymorphicElement as="nav" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </PaginationContextProvider>
    </QdsPaginationContextProvider>
  )
}
