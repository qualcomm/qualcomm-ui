// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsHeaderBarApi} from "./qds-header-bar-context"

export interface HeaderBarNavProps extends ElementRenderProp<"nav"> {}

export function HeaderBarNav(props: HeaderBarNavProps): ReactElement {
  const mergedProps = mergeProps(qdsHeaderBarApi.getNavBindings(), props)

  return <PolymorphicElement as="nav" {...mergedProps} />
}
