// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"

import type {linkClasses} from "./link.classes"

export type QdsLinkEmphasis = "default" | "neutral"

export type QdsLinkSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl"

export interface QdsLinkApiProps extends DirectionProperty {
  /**
   * Controls whether the link is interactive. When `true`, pointer/focus
   * events are blocked, and the link is visually dimmed.
   */
  disabled?: boolean

  /**
   * The color of the link.
   *
   * @default 'default'
   */
  emphasis?: QdsLinkEmphasis

  /**
   * The size of the link and its elements. Governs properties like font size,
   * item padding, and icon sizes.
   *
   * @default 'sm'
   */
  size?: QdsLinkSize
}

export interface QdsLinkScope extends DirectionProperty {
  "data-scope": "link"
}

type LinkClasses = typeof linkClasses

export interface QdsLinkRootBindings extends QdsLinkScope {
  className: LinkClasses["root"]
  "data-disabled": BooleanDataAttr
  "data-emphasis": QdsLinkEmphasis
  "data-part": "root"
  "data-size": QdsLinkSize
}

export interface QdsLinkStartIconBindings extends QdsLinkScope {
  className: LinkClasses["icon"]
  "data-part": "icon"
  "data-placement": "start"
  "data-size": QdsLinkSize
}

export interface QdsLinkEndIconBindings extends QdsLinkScope {
  className: LinkClasses["icon"]
  "data-part": "icon"
  "data-placement": "end"
  "data-size": QdsLinkSize
}

export interface QdsLinkApi {
  emphasis: QdsLinkEmphasis
  size: QdsLinkSize

  // group: bindings
  getEndIconBindings(): QdsLinkEndIconBindings
  getRootBindings(): QdsLinkRootBindings
  getStartIconBindings(): QdsLinkStartIconBindings
}
