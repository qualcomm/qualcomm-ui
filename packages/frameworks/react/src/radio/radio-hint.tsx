// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useRadioItemHint} from "@qualcomm-ui/react-core/radio"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {InputHint, type InputHintProps} from "@qualcomm-ui/react/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsRadioContext} from "./qds-radio-context.js"

export interface RadioHintProps extends IdProp, InputHintProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A help message displayed below the radio. Renders a `<div>` element by
 * default.
 */
export function RadioHint({
  children,
  id,
  ...props
}: RadioHintProps): ReactElement {
  const contextProps = useRadioItemHint({id})
  const qdsContext = useQdsRadioContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getItemHintBindings(),
    props,
  )

  return <InputHint {...mergedProps}>{children}</InputHint>
}
