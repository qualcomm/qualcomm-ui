// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsHeaderBarApi} from "./qds-header-bar-context"

export interface HeaderBarAppTitleProps extends ElementRenderProp<"div"> {}

export function HeaderBarAppTitle(props: HeaderBarAppTitleProps): ReactElement {
  const mergedProps = mergeProps(qdsHeaderBarApi.getAppTitleBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}
