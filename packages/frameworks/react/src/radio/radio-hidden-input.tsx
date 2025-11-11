// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import {useRadioItemHiddenInput} from "@qualcomm-ui/react-core/radio"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsRadioContext} from "./qds-radio-context"

export interface RadioHiddenInputProps
  extends ComponentPropsWithRef<"input">,
    IdProp {}

export function RadioHiddenInput({
  id,
  ...props
}: RadioHiddenInputProps): ReactElement {
  const contextProps = useRadioItemHiddenInput({id})
  const qdsContext = useQdsRadioContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getItemHiddenInputBindings(),
    props,
  )

  return <input {...mergedProps} />
}
