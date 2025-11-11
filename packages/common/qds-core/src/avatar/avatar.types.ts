// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {avatarClasses} from "./avatar.classes"

export type QdsAvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

type AvatarClasses = typeof avatarClasses

export type QdsAvatarVariant = "neutral" | "contrast" | "brand"

export interface QdsAvatarApiProps {
  /**
   * Governs the width and height of the avatar as well as the font size of its
   * content.
   */
  size?: QdsAvatarSize

  /**
   * Optional status for the avatar, renders a dot indicator next to the avatar.
   */
  status?: QdsAvatarStatus

  /**
   * The style variant of the avatar.
   */
  variant?: QdsAvatarVariant
}

export type QdsAvatarStatus = "offline" | "active" | "away" | "busy"

export interface QdsAvatarRootBindings {
  className: AvatarClasses["root"]
  "data-size": QdsAvatarSize
}

export interface QdsAvatarContentBindings {
  className: AvatarClasses["content"]
  "data-variant": QdsAvatarVariant
}

export interface QdsAvatarStatusBindings {
  className: AvatarClasses["status"]
  "data-status": QdsAvatarStatus
}

export interface QdsAvatarImageBindings {
  className: AvatarClasses["image"]
}

export interface QdsAvatarApi {
  size: QdsAvatarSize
  status?: QdsAvatarStatus
  variant: QdsAvatarVariant

  // group: bindings
  getContentBindings(): QdsAvatarContentBindings
  getImageBindings(): QdsAvatarImageBindings
  getRootBindings(): QdsAvatarRootBindings
  getStatusBindings(): QdsAvatarStatusBindings
}
