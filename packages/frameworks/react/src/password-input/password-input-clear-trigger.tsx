// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {X} from "lucide-react"

import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import {useQdsInputContext} from "@qualcomm-ui/react/input"
import {CorePasswordInput} from "@qualcomm-ui/react-core/password-input"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PasswordInputClearTriggerProps
  extends ElementRenderProp<"button"> {}

export function PasswordInputClearTrigger(
  props: PasswordInputClearTriggerProps,
): ReactElement {
  const contextProps = CorePasswordInput.usePasswordInputClearTrigger()
  const qdsContext = useQdsInputContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getClearTriggerBindings(),
    props,
  )

  return <InlineIconButton icon={X} {...mergedProps} />
}
