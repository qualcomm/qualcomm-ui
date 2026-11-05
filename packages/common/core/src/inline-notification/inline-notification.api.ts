// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {ariaAttr} from "@qualcomm-ui/utils/attributes"
import type {
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import {inlineNotificationAnatomy} from "./inline-notification.anatomy.js"
import type {
  InlineNotificationActionBindings,
  InlineNotificationApi,
  InlineNotificationCloseTriggerBindings,
  InlineNotificationDescriptionBindings,
  InlineNotificationIconBindings,
  InlineNotificationLabelBindings,
  InlineNotificationRootBindings,
  InlineNotificationSchema,
} from "./inline-notification.types.js"
import {domIds} from "./internal/index.js"

const parts = inlineNotificationAnatomy.parts

export function createInlineNotificationApi(
  machine: Machine<InlineNotificationSchema>,
  normalize: PropNormalizer,
): InlineNotificationApi {
  const {prop, scope, send, state} = machine

  const visible = state.matches("visible")

  return {
    visible,

    // group: bindings
    getActionBindings(): InlineNotificationActionBindings {
      return normalize.element({
        ...parts.action,
      })
    },
    getCloseTriggerBindings(
      props: IdRegistrationProps,
    ): InlineNotificationCloseTriggerBindings {
      scope.ids.register("closeTrigger", props)
      return normalize.button({
        ...parts.closeTrigger,
        "aria-label": "Dismiss notification",
        id: props.id,
        onClick: (event) => {
          if (!event.defaultPrevented) {
            send({type: "DISMISS"})
          }
        },
        type: "button",
      })
    },
    getDescriptionBindings(
      props: IdRegistrationProps,
    ): InlineNotificationDescriptionBindings {
      scope.ids.register("description", props)
      return normalize.element({
        ...parts.description,
        id: props.id,
      })
    },
    getIconBindings(): InlineNotificationIconBindings {
      return normalize.element({
        ...parts.statusIcon,
      })
    },
    getLabelBindings(
      props: IdRegistrationProps,
    ): InlineNotificationLabelBindings {
      scope.ids.register("heading", props)
      return normalize.element({
        ...parts.heading,
        id: props.id,
      })
    },
    getRootBindings(props): InlineNotificationRootBindings {
      scope.ids.register("root", props)
      return normalize.element({
        ...parts.root,
        "aria-describedby": ariaAttr(domIds.description(scope)),
        "aria-labelledby": ariaAttr(domIds.heading(scope)),
        "aria-live": prop("role") === "status" ? "polite" : "assertive",
        "data-state": visible ? "visible" : "dismissed",
        dir: prop("dir"),
        hidden: !visible,
        role: prop("role"),
      })
    },
  }
}
