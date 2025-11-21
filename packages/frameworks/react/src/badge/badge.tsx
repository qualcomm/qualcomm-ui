// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  createQdsTextBadgeApi,
  type QdsTextBadgeProps as QdsTextBadgeProps,
} from "@qualcomm-ui/qds-core/badge"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface BadgeProps
  extends QdsTextBadgeProps,
    ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function Badge({
  children,
  disabled,
  emphasis,
  size,
  variant,
  ...restProps
}: BadgeProps): ReactElement {
  const qdsApi = createQdsTextBadgeApi(
    {
      disabled,
      emphasis,
      size,
      variant,
    },
    normalizeProps,
  )

  const mergedProps = mergeProps(qdsApi.getRootBindings(), restProps)

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
