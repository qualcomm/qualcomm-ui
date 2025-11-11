import {ariaHidden} from "@qualcomm-ui/dom/aria-hidden"
import {trackDismissableElement} from "@qualcomm-ui/dom/dismissable"
import {trapFocus} from "@qualcomm-ui/dom/focus-trap"
import {raf} from "@qualcomm-ui/dom/query"
import {preventBodyScroll} from "@qualcomm-ui/dom/remove-scroll"
import {isDefined} from "@qualcomm-ui/utils/guard"
import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"

import type {DialogApiProps, DialogSchema} from "./dialog.types"
import {domEls} from "./internal"

export const dialogMachine: MachineConfig<DialogSchema> =
  createMachine<DialogSchema>({
    actions: {
      invokeOnClose: ({prop}) => {
        prop("onOpenChange")?.(false)
      },
      invokeOnOpen: ({prop}) => {
        prop("onOpenChange")?.(true)
      },
      syncZIndex: ({scope}) => {
        raf(() => {
          const contentEl = domEls.content(scope)
          if (!contentEl) {
            return
          }

          const styles = getComputedStyle(contentEl)
          const elems = [domEls.positioner(scope), domEls.backdrop(scope)]
          elems.forEach((node) => {
            node?.style.setProperty("--z-index", styles.zIndex)
          })
        })
      },
      toggleVisibility: ({prop, send}) => {
        send({type: prop("open") ? "CONTROLLED.OPEN" : "CONTROLLED.CLOSE"})
      },
    },

    effects: {
      hideContentBelow({prop, scope}) {
        if (!prop("modal")) {
          return
        }
        const getElements = () => [domEls.content(scope)]
        return ariaHidden(getElements, {defer: true})
      },

      preventScroll({prop, scope}) {
        if (!prop("preventScroll")) {
          return
        }
        return preventBodyScroll(scope.getDoc())
      },

      trackDismissableElement({prop, scope, send}) {
        const getContentEl = () => domEls.content(scope)
        return trackDismissableElement(getContentEl, {
          defer: true,
          exclude: () => [domEls.trigger(scope)],
          onDismiss() {
            send({src: "interact-outside", type: "CLOSE"})
          },
          onEscapeKeyDown(event) {
            prop("onEscapeKeyDown")?.(event)
            if (!prop("closeOnEscape")) {
              event.preventDefault()
            }
          },
          onFocusOutside: prop("onFocusOutside"),
          onInteractOutside(event) {
            prop("onInteractOutside")?.(event)
            if (!prop("closeOnInteractOutside")) {
              event.preventDefault()
            }
          },
          onPointerDownOutside: prop("onPointerDownOutside"),
          onRequestDismiss: prop("onRequestDismiss"),
          persistentElements: prop("persistentElements"),
          pointerBlocking: prop("modal"),
        })
      },

      trapFocus: ({prop, scope}) => {
        if (!prop("trapFocus") || !prop("modal")) {
          return
        }
        const contentEl = () => domEls.content(scope)
        return trapFocus(contentEl, {
          initialFocus: prop("initialFocusEl"),
          preventScroll: true,
          returnFocusOnDeactivate: prop("restoreFocus"),
          setReturnFocus: (el) => prop("finalFocusEl")?.() ?? el,
        })
      },
    },

    guards: {
      isOpenControlled: ({prop}) => isDefined(prop("open")),
    },

    ids: ({bindableId}) => ({
      backdrop: bindableId<string>(),
      closeTrigger: bindableId<string>(),
      content: bindableId<string>(),
      description: bindableId<string>(),
      label: bindableId<string>(),
      positioner: bindableId<string>(),
      trigger: bindableId<string>(),
    }),

    initialState({prop}) {
      const open = prop("open") || prop("defaultOpen")
      return open ? "open" : "closed"
    },

    props: ({props, scope}) => {
      const alertDialog = props.role === "alertdialog"
      const initialFocusEl: DialogApiProps["initialFocusEl"] = alertDialog
        ? () => domEls.closeTrigger(scope)
        : undefined
      return {
        closeOnEscape: true,
        closeOnInteractOutside: !alertDialog,
        dir: "ltr",
        initialFocusEl: initialFocusEl!,
        modal: true,
        preventScroll: true,
        restoreFocus: true,
        role: "dialog",
        trapFocus: true,
        ...props,
      }
    },

    states: {
      closed: {
        on: {
          "CONTROLLED.OPEN": {
            target: "open",
          },
          OPEN: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnOpen"],
              target: "open",
            },
          ],
          TOGGLE: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnOpen"],
              target: "open",
            },
          ],
        },
      },
      open: {
        effects: [
          "trackDismissableElement",
          "trapFocus",
          "preventScroll",
          "hideContentBelow",
        ],
        entry: ["syncZIndex"],
        on: {
          CLOSE: [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose"],
              target: "closed",
            },
          ],
          "CONTROLLED.CLOSE": {
            target: "closed",
          },
          TOGGLE: [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose"],
              target: "closed",
            },
          ],
        },
      },
    },

    watch({actions, prop, track}) {
      track([() => prop("open")], () => {
        actions.toggleVisibility()
      })
    },
  })
