import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"

import type {SideNavSchema} from "./side-nav.types"

export const sideNavMachine: MachineConfig<SideNavSchema> =
  createMachine<SideNavSchema>({
    actions: {
      invokeOnClose: ({prop}) => {
        prop("onOpenChange")?.(false)
      },

      invokeOnOpen: ({prop}) => {
        prop("onOpenChange")?.(true)
      },

      toggleOpen: ({context, send}) => {
        send({type: context.get("open") ? "open" : "close"})
      },
    },
    context({bindable, prop}) {
      return {
        open: bindable(() => ({
          defaultValue: prop("defaultOpen"),
          onChange: prop("onOpenChange"),
          value: prop("open"),
        })),
      }
    },
    ids({bindableId}) {
      return {
        root: bindableId(),
        trigger: bindableId(),
      }
    },
    initialState({prop}) {
      const open = prop("open") ?? prop("defaultOpen")
      return open ? "open" : "closed"
    },
    props({props}) {
      return {defaultOpen: true, dir: "ltr", ...props}
    },
    states: {
      closed: {
        on: {
          open: [
            {
              actions: ["invokeOnOpen"],
              target: "open",
            },
          ],
        },
      },

      closing: {
        on: {
          open: [
            {
              actions: ["invokeOnOpen"],
              target: "open",
            },
          ],
        },
      },

      open: {
        on: {
          close: [
            {
              actions: ["invokeOnClose"],
              target: "closing",
            },
          ],
        },
      },
    },
    watch({action, prop, track}) {
      track([() => prop("open")], () => {
        action(["toggleOpen"])
      })
    },
  })
