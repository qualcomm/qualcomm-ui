// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context"

export interface SideNavNodeAccessoryProps extends ElementRenderProp<"div"> {}

export function SideNavNodeAccessory(
  props: SideNavNodeAccessoryProps,
): ReactElement {
  const mergedProps = mergeProps(
    qdsSideNavApi.getNodeAccessoryBindings(),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}
