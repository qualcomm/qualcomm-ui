// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {avatarClasses} from "./avatar.classes"
import type {
  QdsAvatarApi,
  QdsAvatarApiProps,
  QdsAvatarContentBindings,
  QdsAvatarImageBindings,
  QdsAvatarRootBindings,
  QdsAvatarStatusBindings,
} from "./avatar.types"

export function createQdsAvatarApi(
  props: QdsAvatarApiProps,
  normalize: PropNormalizer,
): QdsAvatarApi {
  const size = props.size || "md"
  const variant = props.variant || "neutral"

  return {
    size,
    status: props.status,
    variant,

    // group: bindings
    getContentBindings(): QdsAvatarContentBindings {
      return normalize.element({
        className: avatarClasses.content,
        "data-variant": variant,
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
