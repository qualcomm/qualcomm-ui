// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {PaginationApi} from "@qualcomm-ui/core/pagination"
import {usePaginationContext} from "@qualcomm-ui/react-core/pagination"
import {type RenderProp, renderProp} from "@qualcomm-ui/react-core/system"

export interface PaginationContextProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: RenderProp<PaginationApi>
}

export function PaginationContext({
  children,
}: PaginationContextProps): ReactNode {
  const context = usePaginationContext()

  return renderProp(children, context)
}
