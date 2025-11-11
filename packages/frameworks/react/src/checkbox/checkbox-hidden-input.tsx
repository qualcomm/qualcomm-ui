// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import {useCheckboxHiddenInput} from "@qualcomm-ui/react-core/checkbox"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsCheckboxContext} from "./qds-checkbox-context"

export interface CheckboxHiddenInputProps
  extends IdProp,
    ComponentPropsWithRef<"input"> {}

/**
 * Hidden input element used for accessibility and form submissions. Renders an
 * `<input>` element. Note: do not apply typical input props like {@link disabled}
 * to this element. Those are applied to the root element and propagated via
 * internal context.
 */
export function CheckboxHiddenInput({
  id,
  ...props
}: CheckboxHiddenInputProps): ReactElement {
  const contextProps = useCheckboxHiddenInput({id})
  const qdsContext = useQdsCheckboxContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getHiddenInputBindings(),
    props,
  )

  return <input {...mergedProps} />
}
