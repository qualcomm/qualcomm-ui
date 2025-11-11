// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {type LucideIcon, X} from "lucide-react"

import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import {CoreDialog} from "@qualcomm-ui/react-core/dialog"
import type {ElementRenderProp, IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDialogContext} from "./qds-dialog-context"

export interface DialogCloseButtonProps
  extends IdProp,
    ElementRenderProp<"button"> {
  /**
   * @default X
   */
  icon?: LucideIcon
}

/**
 * A button that closes the dialog. Renders a `<button>` element by default.
 */
export function DialogCloseButton({
  icon,
  ...props
}: DialogCloseButtonProps): ReactElement {
  const qdsContext = useQdsDialogContext()
  const mergedProps = mergeProps(qdsContext.getCloseButtonBindings(), props)

  return (
    <CoreDialog.CloseTrigger>
      <InlineIconButton icon={icon || X} {...mergedProps} />
    </CoreDialog.CloseTrigger>
  )
}
