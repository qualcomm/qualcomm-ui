// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {X} from "lucide-react"

import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import {useSelectClearTrigger} from "@qualcomm-ui/react-core/select"
import type {ElementRenderProp, IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context"

export interface SelectClearTriggerProps
  extends IdProp,
    ElementRenderProp<"button"> {}

/**
 * Button that clears the selected value. Renders a `<button>` element by default.
 */
export function SelectClearTrigger({
  children,
  id,
  ...props
}: SelectClearTriggerProps): ReactElement {
  const contextProps = useSelectClearTrigger({id})
  const qdsSelectContext = useQdsSelectContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsSelectContext.getClearTriggerBindings(),
    props,
  )

  return (
    <InlineIconButton icon={X} variant="scale" {...mergedProps}>
      {children}
    </InlineIconButton>
  )
}
