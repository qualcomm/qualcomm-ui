// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  QdsNotificationApiProps,
  QdsNotificationEmphasis,
} from "@qualcomm-ui/qds-core/inline-notification"

import type {toastClasses} from "./toast.classes"

export interface QdsToastApiProps
  extends Pick<QdsNotificationApiProps, "emphasis"> {}

type ToastClasses = typeof toastClasses

export interface QdsToastRootBindings {
  className: ToastClasses["root"]
  "data-emphasis": QdsNotificationEmphasis
}

export interface QdsToastIconBindings {
  className: ToastClasses["icon"]
}

export interface QdsToastLabelBindings {
  className: ToastClasses["label"]
}

export interface QdsToastDescriptionBindings {
  className: ToastClasses["description"]
}

export interface QdsToastActionBindings {
  className: ToastClasses["action"]
}

export interface QdsToastCloseButtonBindings {
  className: ToastClasses["closeButton"]
}

export interface QdsToastApi {
  emphasis: QdsNotificationEmphasis

  // group: bindings
  getActionBindings(): QdsToastActionBindings
  getCloseButtonBindings(): QdsToastCloseButtonBindings
  getDescriptionBindings(): QdsToastDescriptionBindings
  getIconBindings(): QdsToastIconBindings
  getLabelBindings(): QdsToastLabelBindings
  getRootBindings(): QdsToastRootBindings
}
