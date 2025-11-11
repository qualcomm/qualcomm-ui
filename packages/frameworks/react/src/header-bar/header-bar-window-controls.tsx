// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsHeaderBarApi} from "./qds-header-bar-context"

export interface HeaderBarWindowControlsProps
  extends ElementRenderProp<"div"> {}

export function HeaderBarWindowControls(
  props: HeaderBarWindowControlsProps,
): ReactElement {
  const mergedProps = mergeProps(
    qdsHeaderBarApi.getWindowControlsBindings(),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}
