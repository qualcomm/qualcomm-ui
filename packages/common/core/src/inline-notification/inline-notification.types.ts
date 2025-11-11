// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  BindableIds,
  CommonProperties,
  IdRegistrationProps,
  JSX,
  MachineSchema,
  Scope,
} from "@qualcomm-ui/utils/machine"

export interface InlineNotificationApiProps
  extends CommonProperties,
    DirectionProperty {
  /**
   * Function invoked when the notification is dismissed
   */
  onDismiss?: () => void

  /**
   * The WAI-ARIA {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles role} of the notification.
   * @option `'alert'`: Use this role when the notification is an alert that requires the user's immediate attention, like for errors or urgent information.
   * @option `'status'`: Use this role when the notification is a status message that doesn't require the user's immediate attention, like for success or informational messages.
   *
   * @default 'status'
   */
  role?: "alert" | "status"
}

export interface InlineNotificationElementIds {
  closeTrigger: string
  description: string
  heading: string
  root: string
}

export interface InlineNotificationScope extends Scope {
  ids: BindableIds<InlineNotificationSchema>
}

export interface InlineNotificationSchema extends MachineSchema {
  actions: ActionSchema<"invokeOnDismiss">
  events: {
    type: "DISMISS"
  }
  ids: InlineNotificationElementIds
  props: RequiredBy<InlineNotificationApiProps, "dir" | "role">
  state: "visible" | "dismissed"
}

export interface InlineNotificationCommonBindings extends DirectionProperty {
  "data-scope": "inline-notification"
}

export interface InlineNotificationRootBindings
  extends InlineNotificationCommonBindings {
  "aria-live": "polite" | "assertive"
  "data-part": "root"
  "data-state": "visible" | "dismissed"
  hidden: boolean | undefined
  role: "alert" | "status"
}

export interface InlineNotificationIconBindings
  extends InlineNotificationCommonBindings {
  "data-part": "status-icon"
}

export interface InlineNotificationLabelBindings
  extends InlineNotificationCommonBindings {
  "data-part": "heading"
  id: string
}

export interface InlineNotificationDescriptionBindings
  extends InlineNotificationCommonBindings {
  "data-part": "description"
  id: string
}

export interface InlineNotificationActionBindings
  extends InlineNotificationCommonBindings {
  "data-part": "action"
}

export interface InlineNotificationCloseTriggerBindings
  extends InlineNotificationCommonBindings {
  "aria-label": string
  "data-part": "close-trigger"
  id: string
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface InlineNotificationApi {
  visible: boolean

  // group: bindings
  getActionBindings(): InlineNotificationActionBindings
  getCloseTriggerBindings(
    props: IdRegistrationProps,
  ): InlineNotificationCloseTriggerBindings
  getDescriptionBindings(
    props: IdRegistrationProps,
  ): InlineNotificationDescriptionBindings
  getIconBindings(): InlineNotificationIconBindings
  getLabelBindings(props: IdRegistrationProps): InlineNotificationLabelBindings
  getRootBindings(props: IdRegistrationProps): InlineNotificationRootBindings
}
