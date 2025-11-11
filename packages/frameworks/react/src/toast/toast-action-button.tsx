// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {ToastActionOptions} from "@qualcomm-ui/core/toast"
import {Button} from "@qualcomm-ui/react/button"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {CoreToast} from "@qualcomm-ui/react-core/toast"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsToastContext} from "./qds-toast-context"

export interface ToastActionButtonProps extends ElementRenderProp<"button"> {
  /**
   * The action to perform when the button is clicked.
   */
  action: ToastActionOptions
}

export function ToastActionButton({
  action,
  render,
  ...props
}: ToastActionButtonProps): ReactElement | null {
  const qdsContext = useQdsToastContext()
  const mergedProps = mergeProps(qdsContext.getActionBindings(), props)

  return (
    <CoreToast.ActionTrigger {...mergedProps}>
      <PolymorphicElement
        as="button"
        render={
          <Button
            emphasis="neutral"
            render={render}
            size="sm"
            variant="outline"
          />
        }
      >
        {action.label}
      </PolymorphicElement>
    </CoreToast.ActionTrigger>
  )
}
