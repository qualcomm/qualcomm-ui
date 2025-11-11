// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {InputErrorText, type InputErrorTextProps} from "@qualcomm-ui/react/input"
import {useSelectErrorText} from "@qualcomm-ui/react-core/select"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface SelectErrorTextProps extends IdProp, InputErrorTextProps {}

/**
 * Error message displayed when the input is invalid. Renders a `<div>` element by
 * default.
 */
export function SelectErrorText({
  children,
  id,
  ...props
}: SelectErrorTextProps): ReactElement {
  const contextProps = useSelectErrorText({id})
  const mergedProps = mergeProps(contextProps, props)

  return <InputErrorText {...mergedProps}>{children}</InputErrorText>
}
