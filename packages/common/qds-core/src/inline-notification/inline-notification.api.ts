// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {notificationClasses} from "./inline-notification.classes"
import type {
  QdsNotificationActionBindings,
  QdsNotificationApi,
  QdsNotificationApiProps,
  QdsNotificationCloseButtonBindings,
  QdsNotificationDescriptionBindings,
  QdsNotificationIconBindings,
  QdsNotificationLabelBindings,
  QdsNotificationRootBindings,
} from "./inline-notification.types"

export function createQdsInlineNotificationApi(
  props: Explicit<QdsNotificationApiProps>,
  normalize: PropNormalizer,
): QdsNotificationApi {
  const emphasis = props.emphasis || "info"
  const orientation = props.orientation || "horizontal"

  return {
    emphasis,
    orientation,

    // group: bindings
    getActionBindings(): QdsNotificationActionBindings {
      return normalize.element({
        className: notificationClasses.action,
        "data-orientation": orientation,
      })
    },

    getCloseButtonBindings(): QdsNotificationCloseButtonBindings {
      return normalize.element({
        className: notificationClasses.closeButton,
      })
    },
    getDescriptionBindings(): QdsNotificationDescriptionBindings {
      return normalize.element({
        className: notificationClasses.description,
      })
    },
    getHeadingBindings(): QdsNotificationLabelBindings {
      return normalize.element({
        className: notificationClasses.label,
      })
    },
    getIconBindings(): QdsNotificationIconBindings {
      return normalize.element({
        className: notificationClasses.icon,
      })
    },
    getRootBindings(): QdsNotificationRootBindings {
      return normalize.element({
        className: notificationClasses.root,
        "data-emphasis": emphasis,
        "data-orientation": orientation,
      })
    },
  }
}
