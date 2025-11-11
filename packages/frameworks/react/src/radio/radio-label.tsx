// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useRadioItemLabel} from "@qualcomm-ui/react-core/radio"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsRadioContext} from "./qds-radio-context"

export interface RadioLabelProps extends IdProp, ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function RadioLabel({
  children,
  id,
  ...props
}: RadioLabelProps): ReactElement {
  const contextProps = useRadioItemLabel({id})
  const qdsContext = useQdsRadioContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getItemLabelBindings(),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
