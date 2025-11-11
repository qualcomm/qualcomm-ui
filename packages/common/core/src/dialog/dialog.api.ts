import {booleanAriaAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import type {
  DialogApi,
  DialogBackdropBindings,
  DialogBodyBindings,
  DialogCloseTriggerBindings,
  DialogContentBindings,
  DialogDescriptionBindings,
  DialogFooterBindings,
  DialogHeadingBindings,
  DialogPositionerBindings,
  DialogSchema,
  DialogTriggerBindings,
} from "./dialog.types"
import {domIds} from "./internal"

const commonBindings: {"data-scope": "dialog"} = {
  "data-scope": "dialog",
}

export function createDialogApi(
  machine: Machine<DialogSchema>,
  normalize: PropNormalizer,
): DialogApi {
  const {prop, scope, send, state} = machine

  const ariaLabel = prop("aria-label")
  const open = state.matches("open")

  return {
    open,
    setOpen(nextOpen) {
      const open = state.matches("open")
      if (open === nextOpen) {
        return
      }
      send({type: nextOpen ? "OPEN" : "CLOSE"})
    },

    // group: bindings
    getBackdropBindings(props): DialogBackdropBindings {
      scope.ids.register("backdrop", props)
      return normalize.element({
        ...commonBindings,
        "data-part": "backdrop",
        "data-state": state.get(),
        dir: prop("dir"),
        hidden: !open,
        id: props.id,
      })
    },
    getBodyBindings(): DialogBodyBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "body",
      })
    },
    getCloseTriggerBindings(props): DialogCloseTriggerBindings {
      scope.ids.register("closeTrigger", props)
      return normalize.button({
        ...commonBindings,
        "data-part": "close-trigger",
        dir: prop("dir"),
        id: props.id,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          send({type: "CLOSE"})
        },
        type: "button",
      })
    },
    getContentBindings(props): DialogContentBindings {
      scope.ids.register("content", props)
      const labelId = domIds.label(scope)
      return normalize.element({
        ...commonBindings,
        "aria-describedby": domIds.description(scope) || undefined,
        "aria-label": ariaLabel || undefined,
        "aria-labelledby": ariaLabel || !labelId ? undefined : labelId,
        "aria-modal": prop("modal"),
        "data-part": "content",
        "data-state": state.get(),
        dir: prop("dir"),
        hidden: !open,
        id: props.id,
        role: prop("role"),
        tabIndex: -1,
      })
    },
    getDescriptionBindings(props): DialogDescriptionBindings {
      scope.ids.register("description", props)
      return normalize.element({
        ...commonBindings,
        "data-part": "description",
        dir: prop("dir"),
        id: props.id,
      })
    },
    getFooterBindings(): DialogFooterBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "footer",
        dir: prop("dir"),
      })
    },
    getHeadingBindings(props): DialogHeadingBindings {
      scope.ids.register("label", props)
      return normalize.element({
        ...commonBindings,
        "data-part": "heading",
        dir: prop("dir"),
        id: props.id,
      })
    },
    getPositionerBindings(props): DialogPositionerBindings {
      scope.ids.register("positioner", props)
      return normalize.element({
        ...commonBindings,
        "data-part": "positioner",
        dir: prop("dir"),
        id: props.id,
        style: {
          pointerEvents: open ? undefined : "none",
        },
      })
    },
    getTriggerBindings(props): DialogTriggerBindings {
      scope.ids.register("trigger", props)
      return normalize.button({
        ...commonBindings,
        "aria-controls": domIds.content(scope),
        "aria-expanded": booleanAriaAttr(open),
        "aria-haspopup": "dialog",
        "data-part": "trigger",
        "data-state": state.get(),
        dir: prop("dir"),
        id: props.id,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          send({type: "TOGGLE"})
        },
        type: "button",
      })
    },
  }
}
