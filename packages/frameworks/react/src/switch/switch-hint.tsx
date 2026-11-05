// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useSwitchHint} from "@qualcomm-ui/react-core/switch"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {InputHint, type InputHintProps} from "@qualcomm-ui/react/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSwitchContext} from "./qds-switch-context.js"

export interface SwitchHintProps extends IdProp, InputHintProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A help message displayed below the switch. Renders a `<div>` element by
 * default.
 */
export function SwitchHint({
  children,
  id,
  ...props
}: SwitchHintProps): ReactElement {
  const contextProps = useSwitchHint({id})
  const qdsContext = useQdsSwitchContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getHintBindings(),
    props,
  )

  return <InputHint {...mergedProps}>{children}</InputHint>
}
