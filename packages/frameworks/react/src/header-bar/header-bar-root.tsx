// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {QdsHeaderBarRootProps} from "@qualcomm-ui/qds-core/header-bar"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsHeaderBarApi} from "./qds-header-bar-context"

export interface HeaderBarRootProps
  extends ElementRenderProp<"div">,
    QdsHeaderBarRootProps {}

export function HeaderBarRoot({
  size,
  surface,
  ...props
}: HeaderBarRootProps): ReactElement {
  const mergedProps = mergeProps(
    qdsHeaderBarApi.getRootBindings({size, surface}),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}
