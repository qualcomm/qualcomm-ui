// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  createQdsStatusBadgeApi,
  type QdsStatusBadgeProps as QdsStatusBadgeProps,
} from "@qualcomm-ui/qds-core/badge"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface StatusBadgeProps
  extends QdsStatusBadgeProps,
    ElementRenderProp<"span"> {}

export function StatusBadge({
  disabled,
  emphasis,
  size,
  variant,
  ...restProps
}: StatusBadgeProps): ReactElement {
  const qdsApi = createQdsStatusBadgeApi(
    {
      disabled,
      emphasis,
      size,
      variant,
    },
    normalizeProps,
  )

  const mergedProps = mergeProps(qdsApi.getRootBindings(), restProps)

  return <PolymorphicElement as="span" {...mergedProps} />
}
