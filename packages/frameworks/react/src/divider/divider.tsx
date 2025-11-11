// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  createQdsDividerApi,
  dividerClasses,
  type QdsDividerApiProps,
} from "@qualcomm-ui/qds-core/divider"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface DividerProps
  extends QdsDividerApiProps,
    ElementRenderProp<"div"> {}

/**
 * A divider that separates content with a simple line. Renders a `<div>` element by
 * default.
 */
export function Divider({...props}: DividerProps): ReactElement {
  const divider = createQdsDividerApi(props, normalizeProps)
  const mergedProps = mergeProps(
    divider.getRootBindings(),
    {className: dividerClasses.root},
    props,
  )
  return <PolymorphicElement as="div" {...mergedProps} />
}
