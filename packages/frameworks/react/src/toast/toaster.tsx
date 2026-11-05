// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {ToastOptions} from "@qualcomm-ui/core/toast"
import type {FunctionRenderProp} from "@qualcomm-ui/react-core/system"
import {CoreToaster, type CoreToasterProps} from "@qualcomm-ui/react-core/toast"

import type {ToasterInstance} from "./create-toaster.js"
import {ToastActionButton} from "./toast-action-button.js"
import {ToastCloseButton} from "./toast-close-button.js"
import {ToastDescription} from "./toast-description.js"
import {ToastIcon} from "./toast-icon.js"
import {ToastLabel} from "./toast-label.js"
import {ToastRoot} from "./toast-root.js"

export interface ToasterProps extends Omit<CoreToasterProps, "children"> {
  /**
   * {@link https://react-next.qui.qualcomm.com/render-props#functionrenderprop Render Prop}
   * that provides the {@link ToastOptions}.
   *
   * @inheritDoc
   */
  children?: FunctionRenderProp<ToastOptions>

  /**
   * The {@link ToasterInstance} instance.
   *
   * @inheritDoc
   */
  toaster: ToasterInstance
}

export function Toaster({
  children,
  toaster,
  ...props
}: ToasterProps): ReactElement {
  return (
    <CoreToaster toaster={toaster} {...props}>
      {children || DefaultToast}
    </CoreToaster>
  )
}

function DefaultToast(toast: ToastOptions<ReactElement | string>) {
  return (
    <ToastRoot key={toast.id}>
      <ToastIcon />
      <ToastLabel>{toast.label}</ToastLabel>
      <ToastDescription>{toast.description}</ToastDescription>
      {toast.action ? <ToastActionButton action={toast.action} /> : null}
      {toast.closable ? <ToastCloseButton /> : null}
    </ToastRoot>
  )
}
