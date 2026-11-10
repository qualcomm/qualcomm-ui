// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {X} from "lucide-react"

import {CorePasswordInput} from "@qualcomm-ui/react-core/password-input"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {IconButton} from "@qualcomm-ui/react/button"
import {useQdsInputContext} from "@qualcomm-ui/react/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PasswordInputClearTriggerProps extends ElementRenderProp<"button"> {}

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

  return (
    <IconButton density="compact" icon={X} variant="ghost" {...mergedProps} />
  )
}
