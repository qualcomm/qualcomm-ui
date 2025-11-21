// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  createQdsNumberBadgeApi,
  type QdsNumberBadgeProps as QdsNumberBadgeProps,
} from "@qualcomm-ui/qds-core/badge"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface NumberBadgeProps
  extends QdsNumberBadgeProps,
    ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   * When provided, overrides type-specific content.
   */
  children?: ReactNode
}

export function NumberBadge({
  children,
  disabled,
  max,
  size,
  value,
  variant,
  ...restProps
}: NumberBadgeProps): ReactElement {
  const qdsApi = createQdsNumberBadgeApi(
    {
      disabled,
      max,
      size,
      value,
      variant,
    },
    normalizeProps,
  )

  const mergedProps = mergeProps(qdsApi.getRootBindings(), restProps)

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children ?? qdsApi.displayValue}
    </PolymorphicElement>
  )
}
