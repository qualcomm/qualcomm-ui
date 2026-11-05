// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {avatarClasses} from "./avatar.classes.js"
import type {
  QdsAvatarApi,
  QdsAvatarApiProps,
  QdsAvatarContentBindings,
  QdsAvatarImageBindings,
  QdsAvatarRootBindings,
  QdsAvatarStatusBindings,
} from "./avatar.types.js"

export function createQdsAvatarApi(
  props: QdsAvatarApiProps,
  normalize: PropNormalizer,
): QdsAvatarApi {
  const size = props.size || "md"
  const emphasis = props.emphasis || props.variant || "neutral"

  return {
    emphasis,
    size,
    status: props.status,

    // group: bindings
    getContentBindings(): QdsAvatarContentBindings {
      return normalize.element({
        className: avatarClasses.content,
        "data-emphasis": emphasis,
      })
    },
    getImageBindings(): QdsAvatarImageBindings {
      return normalize.element({
        className: avatarClasses.image,
      })
    },
    getRootBindings(): QdsAvatarRootBindings {
      return normalize.element({
        className: avatarClasses.root,
        "data-size": size,
      })
    },
    getStatusBindings(): QdsAvatarStatusBindings {
      return normalize.element({
        className: avatarClasses.status,
        "data-status": props.status || "offline",
      })
    },
  }
}
