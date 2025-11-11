import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import type {
  AvatarApi,
  AvatarContentBindings,
  AvatarImageBindings,
  AvatarRootBindings,
  AvatarSchema,
  AvatarStatusBindings,
} from "./avatar.types"

export function createAvatarApi(
  machine: Machine<AvatarSchema>,
  normalize: PropNormalizer,
): AvatarApi {
  const {prop, scope, send, state} = machine

  const loaded = state.matches("loaded")

  const commonProps: {"data-scope": "avatar"; dir: Direction | undefined} = {
    "data-scope": "avatar",
    dir: prop("dir"),
  }

  return {
    getContentBindings(props): AvatarContentBindings {
      scope.ids.register("content", props)
      return normalize.element({
        ...commonProps,
        "data-part": "content",
        "data-state": loaded ? "hidden" : "visible",
        hidden: loaded,
        id: props.id,
      })
    },

    getImageBindings(props): AvatarImageBindings {
      scope.ids.register("image", props)
      return normalize.img({
        ...commonProps,
        "data-part": "image",
        "data-state": loaded ? "visible" : "hidden",
        hidden: !loaded,
        id: props.id,
        onError() {
          send({type: "IMG.ERROR"})
        },
        onLoad() {
          send({type: "IMG.LOADED"})
        },
      })
    },

    getRootBindings(props): AvatarRootBindings {
      scope.ids.register("root", props)
      return normalize.element({
        ...commonProps,
        "data-part": "root",
        id: props.id,
      })
    },

    getStatusBindings(props): AvatarStatusBindings {
      scope.ids.register("status", props)
      return normalize.element({
        ...commonProps,
        "data-part": "status",
        id: props.id,
      })
    },
  }
}
