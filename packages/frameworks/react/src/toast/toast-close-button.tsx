// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {type LucideIcon, X} from "lucide-react"

import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import {
  CoreToast,
  type CoreToastCloseTriggerProps,
} from "@qualcomm-ui/react-core/toast"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsToastContext} from "./qds-toast-context"

export interface ToastCloseButtonProps
  extends Omit<CoreToastCloseTriggerProps, "children"> {
  /**
   * @default X
   */
  icon?: LucideIcon
}

export function ToastCloseButton({
  icon,
  ...props
}: ToastCloseButtonProps): ReactElement {
  const qdsContext = useQdsToastContext()
  const mergedProps = mergeProps(qdsContext.getCloseButtonBindings(), props)

  return (
    <CoreToast.CloseTrigger {...mergedProps}>
      <InlineIconButton icon={icon || X} variant="fixed" />
    </CoreToast.CloseTrigger>
  )
}
