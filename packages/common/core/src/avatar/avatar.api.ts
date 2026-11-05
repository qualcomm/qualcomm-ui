// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import {avatarAnatomy} from "./avatar.anatomy.js"
import type {
  AvatarApi,
  AvatarContentBindings,
  AvatarImageBindings,
  AvatarRootBindings,
  AvatarSchema,
  AvatarStatusBindings,
} from "./avatar.types.js"

const parts = avatarAnatomy.parts

export function createAvatarApi(
  machine: Machine<AvatarSchema>,
  normalize: PropNormalizer,
): AvatarApi {
  const {prop, scope, send, state} = machine

  const loaded = state.matches("loaded")

  return {
    getContentBindings(props): AvatarContentBindings {
      scope.ids.register("content", props)
      return normalize.element({
        ...parts.content,
        "data-state": loaded ? "hidden" : "visible",
        dir: prop("dir"),
        hidden: loaded,
        id: scope.ids.get("content"),
      })
    },

    getImageBindings(props): AvatarImageBindings {
      scope.ids.register("image", props)
      return normalize.img({
        ...parts.image,
        "data-state": loaded ? "visible" : "hidden",
        dir: prop("dir"),
        hidden: !loaded,
        id: scope.ids.get("image"),
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
        ...parts.root,
        dir: prop("dir"),
        id: scope.ids.get("root"),
      })
    },

    getStatusBindings(props): AvatarStatusBindings {
      scope.ids.register("status", props)
      return normalize.element({
        ...parts.status,
        dir: prop("dir"),
        id: scope.ids.get("status"),
      })
    },
  }
}
