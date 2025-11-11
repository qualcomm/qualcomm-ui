// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import {useSwitchHiddenInput} from "@qualcomm-ui/react-core/switch"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSwitchContext} from "./qds-switch-context"

export interface SwitchHiddenInputProps
  extends ComponentPropsWithRef<"input">,
    IdProp {}

/**
 * Hidden input element used for accessibility and form submissions. Renders an
 * `<input>` element. Note: do not apply typical input props like {@link disabled}
 * to this element. Those are applied to the root element and propagated via
 * internal context.
 */
export function SwitchHiddenInput({
  id,
  ...props
}: SwitchHiddenInputProps): ReactElement {
  const contextProps = useSwitchHiddenInput({id})
  const qdsContext = useQdsSwitchContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getHiddenInputBindings(),
    props,
  )

  return <input {...mergedProps} />
}
