// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {InputLabel} from "@qualcomm-ui/react/input"
import {useSelectContext, useSelectLabel} from "@qualcomm-ui/react-core/select"
import type {ElementRenderProp, IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context"

export interface SelectLabelProps extends IdProp, ElementRenderProp<"label"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Label text associated with the select. Renders a `<label>` element by default.
 */
export function SelectLabel({
  children,
  id,
  ...props
}: SelectLabelProps): ReactElement {
  const {required} = useSelectContext()
  const contextProps = useSelectLabel({id})
  const qdsSelectContext = useQdsSelectContext()

  const mergedProps = mergeProps(
    contextProps,
    qdsSelectContext.getLabelBindings(),
    props,
  )

  return (
    <InputLabel required={required} {...mergedProps}>
      {children}
    </InputLabel>
  )
}
