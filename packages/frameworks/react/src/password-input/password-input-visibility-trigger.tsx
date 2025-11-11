// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {Eye, EyeOff} from "lucide-react"

import {passwordInputClasses} from "@qualcomm-ui/qds-core/password-input"
import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {
  CorePasswordInput,
  usePasswordInputContext,
} from "@qualcomm-ui/react-core/password-input"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PasswordInputVisibilityTriggerProps
  extends ElementRenderProp<"button"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * The icon shown when the input text is visible.
   *
   * @default EyeOff
   */
  iconOff?: LucideIconOrElement

  /**
   * The icon shown when the input text is hidden.
   *
   * @default Eye
   */
  iconOn?: LucideIconOrElement
}

export function PasswordInputVisibilityTrigger({
  children,
  iconOff = EyeOff,
  iconOn = Eye,
  id,
  ...props
}: PasswordInputVisibilityTriggerProps): ReactElement {
  const context = usePasswordInputContext()
  const contextProps = CorePasswordInput.usePasswordInputVisibilityTrigger({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: passwordInputClasses.visibilityTrigger},
    props,
  )

  return (
    <InlineIconButton
      icon={context.visible ? iconOff : iconOn}
      {...mergedProps}
    >
      {children}
    </InlineIconButton>
  )
}
