import type {
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import type {
  InlineNotificationActionBindings,
  InlineNotificationApi,
  InlineNotificationCloseTriggerBindings,
  InlineNotificationCommonBindings,
  InlineNotificationDescriptionBindings,
  InlineNotificationIconBindings,
  InlineNotificationLabelBindings,
  InlineNotificationRootBindings,
  InlineNotificationSchema,
} from "./inline-notification.types"
import {domIds} from "./internal"

export function createInlineNotificationApi(
  machine: Machine<InlineNotificationSchema>,
  normalize: PropNormalizer,
): InlineNotificationApi {
  const {prop, scope, send, state} = machine

  const visible = state.matches("visible")

  const commonBindings: InlineNotificationCommonBindings = {
    "data-scope": "inline-notification",
    dir: prop("dir"),
  }

  return {
    visible,

    // group: bindings
    getActionBindings(): InlineNotificationActionBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "action",
      })
    },
    getCloseTriggerBindings(
      props: IdRegistrationProps,
    ): InlineNotificationCloseTriggerBindings {
      scope.ids.register("closeTrigger", props)
      return normalize.button({
        ...commonBindings,
        "aria-label": "Dismiss notification",
        "data-part": "close-trigger",
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
        ...commonBindings,
        "data-part": "description",
        id: props.id,
      })
    },
    getIconBindings(): InlineNotificationIconBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "status-icon",
      })
    },
    getLabelBindings(
      props: IdRegistrationProps,
    ): InlineNotificationLabelBindings {
      scope.ids.register("heading", props)
      return normalize.element({
        ...commonBindings,
        "data-part": "heading",
        id: props.id,
      })
    },
    getRootBindings(props): InlineNotificationRootBindings {
      scope.ids.register("root", props)
      return normalize.element({
        ...commonBindings,
        "aria-describedby": domIds.description(scope),
        "aria-labelledby": domIds.heading(scope),
        "aria-live": prop("role") === "status" ? "polite" : "assertive",
        "data-part": "root",
        "data-state": visible ? "visible" : "dismissed",
        hidden: !visible,
        role: prop("role"),
      })
    },
  }
}
