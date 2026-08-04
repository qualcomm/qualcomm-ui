// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useCheckboxHint} from "@qualcomm-ui/react-core/checkbox"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {InputHint, type InputHintProps} from "@qualcomm-ui/react/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsCheckboxContext} from "./qds-checkbox-context.js"

export interface CheckboxHintProps extends IdProp, InputHintProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A help message displayed below the checkbox. Renders a `<div>` element by
 * default.
 */
export function CheckboxHint({
  children,
  id,
  ...props
}: CheckboxHintProps): ReactElement {
  const contextProps = useCheckboxHint({id})
  const qdsContext = useQdsCheckboxContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getHintBindings(),
    props,
  )

  return <InputHint {...mergedProps}>{children}</InputHint>
}
