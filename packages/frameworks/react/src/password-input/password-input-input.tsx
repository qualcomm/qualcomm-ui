// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import {useQdsInputContext} from "@qualcomm-ui/react/input"
import {CorePasswordInput} from "@qualcomm-ui/react-core/password-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PasswordInputInputProps
  extends ComponentPropsWithRef<"input"> {}

export function PasswordInputInput({
  id,
  ...props
}: PasswordInputInputProps): ReactElement {
  const contextProps = CorePasswordInput.usePasswordInputInput({id})

  const qdsContext = useQdsInputContext()

  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getInputBindings(),
    props,
  )

  return <input {...mergedProps} />
}
