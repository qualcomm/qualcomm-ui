// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useRadioItemControl} from "@qualcomm-ui/react-core/radio"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsRadioContext} from "./qds-radio-context.js"

export interface RadioCheckboxControlProps extends ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function RadioCheckboxControl({
  ...props
}: RadioCheckboxControlProps): ReactElement {
  const contextProps = useRadioItemControl()
  const qdsContext = useQdsRadioContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getItemCheckboxControlBindings(),
    props,
  )

  return <PolymorphicElement as="span" {...mergedProps} />
}
