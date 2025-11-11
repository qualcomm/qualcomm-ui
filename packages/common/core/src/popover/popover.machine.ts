// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {ariaHidden} from "@qualcomm-ui/dom/aria-hidden"
import {trackDismissableElement} from "@qualcomm-ui/dom/dismissable"
import {getPlacement, type Placement} from "@qualcomm-ui/dom/floating-ui"
import {trapFocus} from "@qualcomm-ui/dom/focus-trap"
import {getInitialFocus, proxyTabFocus, raf} from "@qualcomm-ui/dom/query"
import {preventBodyScroll} from "@qualcomm-ui/dom/remove-scroll"
import {isDefined} from "@qualcomm-ui/utils/guard"
import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"

import {domEls} from "./internal"
import type {PopoverSchema} from "./popover.types"

export const popoverMachine: MachineConfig<PopoverSchema> =
  createMachine<PopoverSchema>({
    actions: {
      invokeOnClose: ({prop}) => {
        prop("onOpenChange")?.(false)
      },
      invokeOnOpen: ({prop}) => {
        prop("onOpenChange")?.(true)
      },
      reposition: ({context, event, prop, scope}) => {
        if (event.type !== "POSITIONING.SET") {
          return
        }
        const anchorEl = domEls.anchor(scope) ?? domEls.trigger(scope)
        const getPositionerEl = () => domEls.positioner(scope)
        getPlacement(anchorEl, getPositionerEl, {
          ...prop("positioning"),
          ...event.options,
          defer: true,
          listeners: false,
          onComplete(data) {
            context.set("currentPlacement", data.placement)
          },
        })
      },
      setFinalFocus: ({event, prop, scope}) => {
        const restoreFocus =
          event.type === "CLOSE" || event.type === "CONTROLLED.CLOSE"
            ? prop("restoreFocus") && event.restoreFocus
            : false
        if (restoreFocus != null && !restoreFocus) {
          return
        }
        raf(() => {
          const element = domEls.trigger(scope)
          element?.focus({preventScroll: true})
        })
      },
      setInitialFocus: ({prop, scope}) => {
        if (prop("modal")) {
          return
        }
        raf(() => {
          const element = getInitialFocus({
            enabled: prop("autoFocus"),
            getInitialEl: prop("initialFocusEl"),
            root: domEls.content(scope),
          })
          element?.focus({preventScroll: true})
        })
      },
      toggleVisibility: ({event, prop, send}) => {
        send({
          ...event,
          type: prop("open") ? "CONTROLLED.OPEN" : "CONTROLLED.CLOSE",
        })
      },
    },

    computed: {
      currentPortalled: ({prop}) => {
        return prop("modal") || prop("portalled")
      },
    },

    context: ({bindable}) => {
      return {
        currentPlacement: bindable<Placement | undefined>(() => ({
          defaultValue: undefined,
        })),
      }
    },

    effects: {
      hideContentBelow({prop, scope}) {
        if (!prop("modal")) {
          return
        }
        const getElements = () => [domEls.content(scope), domEls.trigger(scope)]
        return ariaHidden(getElements, {defer: true})
      },

      preventScroll({prop, scope}) {
        if (!prop("modal")) {
          return
        }
        return preventBodyScroll(scope.getDoc())
      },

      proxyTabFocus({prop, scope}) {
        if (prop("modal") || !prop("portalled")) {
          return
        }
        const getContentEl = () => domEls.content(scope)
        return proxyTabFocus(getContentEl, {
          defer: true,
          onFocus(el) {
            el.focus({preventScroll: true})
          },
          triggerElement: domEls.trigger(scope),
        })
      },

      trackDismissableElement({prop, scope, send}) {
        const getContentEl = () => domEls.content(scope)
        let restoreFocus = true
        return trackDismissableElement(getContentEl, {
          defer: true,
          exclude: () => domEls.trigger(scope),
          onDismiss() {
            send({restoreFocus, src: "interact-outside", type: "CLOSE"})
          },
          onEscapeKeyDown(event) {
            prop("onEscapeKeyDown")?.(event)
            if (prop("closeOnEscape")) {
              return
            }
            event.preventDefault()
          },
          onFocusOutside: prop("onFocusOutside"),
          onInteractOutside(event) {
            prop("onInteractOutside")?.(event)
            if (event.defaultPrevented) {
              return
            }
            restoreFocus = !(event.detail.focusable || event.detail.contextmenu)
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

      trackPositioning({context, prop, scope}) {
        context.set("currentPlacement", prop("positioning").placement)
        const getAnchorEl = () => domEls.anchor(scope)
        const getPositionerEl = () => domEls.positioner(scope)
        return getPlacement(getAnchorEl, getPositionerEl, {
          ...prop("positioning"),
          defer: true,
          onComplete(data) {
            context.set("currentPlacement", data.placement)
          },
        })
      },

      trapFocus({prop, scope}) {
        if (!prop("modal")) {
          return
        }
        const contentEl = () => domEls.content(scope)
        return trapFocus(contentEl, {
          initialFocus: () =>
            getInitialFocus({
              enabled: prop("autoFocus"),
              getInitialEl: prop("initialFocusEl"),
              root: domEls.content(scope),
            }),
        })
      },
    },

    guards: {
      isOpenControlled: ({prop}) => isDefined(prop("open")),
    },

    ids: ({bindableId}) => {
      return {
        anchor: bindableId<string>(),
        arrow: bindableId<string>(),
        closeTrigger: bindableId<string>(),
        content: bindableId<string>(),
        description: bindableId<string>(),
        positioner: bindableId<string>(),
        title: bindableId<string>(),
        trigger: bindableId<string>(),
      }
    },

    initialState({prop}) {
      const open = prop("open") || prop("defaultOpen")
      return open ? "open" : "closed"
    },

    props({props}) {
      return {
        autoFocus: true,
        closeOnEscape: true,
        closeOnInteractOutside: true,
        modal: false,
        portalled: true,
        restoreFocus: true,
        ...props,
        positioning: {placement: "top", ...props.positioning},
      }
    },

    states: {
      closed: {
        on: {
          "CONTROLLED.OPEN": {
            actions: ["setInitialFocus"],
            target: "open",
          },
          OPEN: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnOpen", "setInitialFocus"],
              target: "open",
            },
          ],
          TOGGLE: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnOpen", "setInitialFocus"],
              target: "open",
            },
          ],
        },
      },
      open: {
        effects: [
          "trapFocus",
          "preventScroll",
          "hideContentBelow",
          "trackPositioning",
          "trackDismissableElement",
          "proxyTabFocus",
        ],
        on: {
          CLOSE: [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose", "setFinalFocus"],
              target: "closed",
            },
          ],
          "CONTROLLED.CLOSE": {
            actions: ["setFinalFocus"],
            target: "closed",
          },
          "POSITIONING.SET": {
            actions: ["reposition"],
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
