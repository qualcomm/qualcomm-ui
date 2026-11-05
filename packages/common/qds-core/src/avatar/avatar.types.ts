// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {avatarClasses} from "./avatar.classes.js"

export type QdsAvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

type AvatarClasses = typeof avatarClasses

export type QdsAvatarEmphasis = "neutral" | "contrast" | "brand"

/**
 * @deprecated use {@link QdsAvatarEmphasis} instead
 */
export type QdsAvatarVariant = QdsAvatarEmphasis

export interface QdsAvatarApiProps {
  /**
   * The style of the avatar.
   */
  emphasis?: QdsAvatarEmphasis

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
   * @deprecated use {@link emphasis} instead
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
  "data-emphasis": QdsAvatarEmphasis
}

export interface QdsAvatarStatusBindings {
  className: AvatarClasses["status"]
  "data-status": QdsAvatarStatus
}

export interface QdsAvatarImageBindings {
  className: AvatarClasses["image"]
}

export interface QdsAvatarApi {
  emphasis: QdsAvatarEmphasis
  size: QdsAvatarSize
  status?: QdsAvatarStatus

  // group: bindings
  getContentBindings(): QdsAvatarContentBindings
  getImageBindings(): QdsAvatarImageBindings
  getRootBindings(): QdsAvatarRootBindings
  getStatusBindings(): QdsAvatarStatusBindings
}
