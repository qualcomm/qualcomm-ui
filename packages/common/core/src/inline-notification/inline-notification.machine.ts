import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"

import type {InlineNotificationSchema} from "./inline-notification.types"

export const inlineNotificationMachine: MachineConfig<InlineNotificationSchema> =
  createMachine<InlineNotificationSchema>({
    actions: {
      invokeOnDismiss({prop}) {
        prop("onDismiss")?.()
      },
    },
    ids: ({bindableId}) => ({
      closeTrigger: bindableId(),
      description: bindableId(),
      heading: bindableId(),
      root: bindableId(),
    }),
    initialState: () => "visible",
    props({props}) {
      return {
        dir: "ltr",
        role: "status",
        ...props,
      }
    },
    states: {
      dismissed: {},
      visible: {
        on: {
          DISMISS: {
            actions: ["invokeOnDismiss"],
            target: "dismissed",
          },
        },
      },
    },
  })
