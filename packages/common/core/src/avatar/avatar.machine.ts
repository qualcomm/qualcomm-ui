import {observeAttributes, observeChildren} from "@qualcomm-ui/dom/query"
import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"

import type {AvatarSchema} from "./avatar.types"
import {domEls} from "./internal"

export const avatarMachine: MachineConfig<AvatarSchema> =
  createMachine<AvatarSchema>({
    actions: {
      checkImageStatus({scope, send}) {
        const imageEl = domEls.image(scope)
        if (!imageEl?.complete) {
          return
        }
        const type = hasLoaded(imageEl) ? "IMG.LOADED" : "IMG.ERROR"
        send({type})
      },
      invokeOnError({prop}) {
        prop("onStateChange")?.({state: "error"})
      },
      invokeOnLoad({prop}) {
        prop("onStateChange")?.({state: "loaded"})
      },
    },

    effects: {
      trackImageRemoval({scope, send}) {
        const rootEl = domEls.root(scope)
        return observeChildren(rootEl, {
          callback(records) {
            const removedNodes = Array.from(records[0].removedNodes)
            const removed = removedNodes.find(
              (node) =>
                node.nodeType === Node.ELEMENT_NODE &&
                (node as Element).matches(
                  "[data-scope=avatar][data-part=image]",
                ),
            )
            if (removed) {
              send({type: "IMG.UNMOUNT"})
            }
          },
        })
      },

      trackSrcChange({scope, send}) {
        const imageEl = domEls.image(scope)
        return observeAttributes(imageEl, {
          attributes: ["src", "srcset"],
          callback() {
            send({type: "SRC.CHANGE"})
          },
        })
      },
    },

    ids: ({bindableId}) => {
      return {
        content: bindableId<string>(),
        image: bindableId<string>(),
        root: bindableId<string>(),
        status: bindableId<string>(),
      }
    },

    initialState: () => "loading",

    on: {
      "IMG.UNMOUNT": {
        target: "error",
      },
      "SRC.CHANGE": {
        target: "loading",
      },
    },

    props: ({props}) => ({
      dir: "ltr",
      ...props,
    }),

    states: {
      error: {
        on: {
          "IMG.LOADED": {
            actions: ["invokeOnLoad"],
            target: "loaded",
          },
        },
      },
      loaded: {
        on: {
          "IMG.ERROR": {
            actions: ["invokeOnError"],
            target: "error",
          },
        },
      },
      loading: {
        entry: ["checkImageStatus"],
        on: {
          "IMG.ERROR": {
            actions: ["invokeOnError"],
            target: "error",
          },
          "IMG.LOADED": {
            actions: ["invokeOnLoad"],
            target: "loaded",
          },
        },
      },
    },
  })

function hasLoaded(image: HTMLImageElement) {
  return image.complete && image.naturalWidth !== 0 && image.naturalHeight !== 0
}
