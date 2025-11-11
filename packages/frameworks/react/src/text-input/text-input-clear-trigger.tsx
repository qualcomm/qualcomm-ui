// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {X} from "lucide-react"

import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import {useQdsInputContext} from "@qualcomm-ui/react/input"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {useTextInputClearTrigger} from "@qualcomm-ui/react-core/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TextInputClearTriggerProps
  extends ElementRenderProp<"button"> {}

/**
 * Button that clears the input value. Renders a `<button>` element by default.
 */
export function TextInputClearTrigger(
  props: TextInputClearTriggerProps,
): ReactElement {
  const contextProps = useTextInputClearTrigger()
  const qdsContext = useQdsInputContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getClearTriggerBindings(),
    props,
  )

  return (
    <InlineIconButton
      icon={X}
      size={qdsContext.size}
      variant="scale"
      {...mergedProps}
    />
  )
}
