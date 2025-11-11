import {trackEscapeKeydown} from "@qualcomm-ui/dom/dismissable"
import {getPlacement, type Placement} from "@qualcomm-ui/dom/floating-ui"
import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"

import {store} from "./tooltip.store"
import type {TooltipSchema} from "./tooltip.types"

export const tooltipMachine: MachineConfig<TooltipSchema> =
  createMachine<TooltipSchema>({
    actions: {
      clearGlobalId: ({scope}) => {
        if (store.openId === scope.ids.get("content")) {
          store.openId = null
          store.close = () => {}
        }
      },
      closeIfDisabled: ({prop, send}) => {
        if (!prop("disabled")) {
          return
        }
        send({type: "CLOSE"})
      },
      invokeOnClose: ({prop}) => {
        prop("onOpenChange")?.(false)
      },
      invokeOnOpen: ({prop}) => {
        prop("onOpenChange")?.(true)
      },
      setGlobalId: ({scope, send}) => {
        if (store.openId) {
          store.close()
        }
        store.openId = scope.ids.get("content")
        store.close = () => send({type: "CLOSE"})
      },
    },

    context: ({bindable}) => {
      return {
        currentPlacement: bindable<Placement | undefined, void>(() => ({
          defaultValue: undefined,
        })),
      }
    },

    effects: {
      trackEscapeKey(params) {
        if (!params.prop("closeOnEscape")) {
          return
        }
        return trackEscapeKeydown(document, () => {
          params.send({type: "CLOSE"})
        })
      },
      trackPositioning: ({context, prop, scope}) => {
        if (!context.get("currentPlacement")) {
          context.set("currentPlacement", prop("positioning")?.placement)
        }
        const triggerEl = scope.getById(scope.ids.get("trigger"))
        const getPositionerEl = () => scope.getById(scope.ids.get("positioner"))
        return getPlacement(triggerEl, getPositionerEl, {
          ...prop("positioning"),
          defer: true,
          onComplete(data) {
            context.set("currentPlacement", data.placement)
          },
        })
      },
    },

    guards: {
      noVisibleTooltip: () => store.openId === null,
    },

    ids: ({bindableId}) => {
      return {
        arrow: bindableId<string>(),
        content: bindableId<string>(),
        positioner: bindableId<string>(),
        root: bindableId<string>(),
        trigger: bindableId<string>(),
      }
    },

    initialState: ({prop}) => {
      const open = prop("open")
      return open ? "open" : "closed"
    },

    props: ({props}) => ({
      closeOnClick: true,
      closeOnEscape: true,
      disabled: false,
      ...props,
      positioning: {
        arrowPadding: 10,
        placement: "top",
        ...props.positioning,
      },
    }),

    states: {
      closed: {
        entry: ["clearGlobalId"],
        on: {
          OPEN: {
            actions: ["invokeOnOpen"],
            target: "open",
          },
          "POINTER.ENTER": {
            actions: ["invokeOnOpen"],
            target: "open",
          },
        },
      },
      open: {
        effects: ["trackEscapeKey", "trackPositioning"],
        entry: ["setGlobalId"],
        on: {
          CLOSE: {
            actions: ["invokeOnClose"],
            target: "closed",
          },
          "POINTER.CLICK": {
            actions: ["invokeOnClose"],
            target: "closed",
          },
          "POINTER.LEAVE": {
            actions: ["invokeOnClose"],
            target: "closed",
          },
        },
      },
    },

    watch({actions, prop, send, track}) {
      track([() => prop("disabled")], () => {
        actions.closeIfDisabled()
      })

      track([() => prop("open")], () => {
        if (prop("open")) {
          send({type: "OPEN"})
        } else {
          send({type: "CLOSE"})
        }
      })
    },
  })
