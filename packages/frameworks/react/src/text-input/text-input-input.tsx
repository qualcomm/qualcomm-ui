// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import {useQdsInputContext} from "@qualcomm-ui/react/input"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {useTextInputInput} from "@qualcomm-ui/react-core/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TextInputInputProps
  extends ComponentPropsWithRef<"input">,
    IdProp {}

/**
 * The text input element. Renders an `<input>` element.
 */
export function TextInputInput({
  id,
  ...props
}: TextInputInputProps): ReactElement {
  const contextProps = useTextInputInput({id})

  const qdsContext = useQdsInputContext()

  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getInputBindings(),
    props,
  )

  return <input {...mergedProps} />
}
