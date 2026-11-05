// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import type {IdProp} from "@qualcomm-ui/react-core/system"
import {useTextAreaInput} from "@qualcomm-ui/react-core/text-area"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTextAreaContext} from "./qds-text-area-context.js"

export interface TextAreaInputProps
  extends ComponentPropsWithRef<"textarea">, IdProp {}

/**
 * The text area element. Renders a `<textarea>` element.
 */
export function TextAreaInput({
  id,
  ...props
}: TextAreaInputProps): ReactElement {
  const contextProps = useTextAreaInput({id})
  const qdsContext = useQdsTextAreaContext()

  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getInputBindings(),
    props,
  )

  return <textarea {...mergedProps} />
}
