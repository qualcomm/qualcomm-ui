// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  QdsDialogApiProps,
  QdsDialogSize,
} from "@qualcomm-ui/qds-core/dialog"

import type {drawerClasses} from "./drawer.classes"

export type QdsDrawerPlacement = "start" | "end"

export type QdsDrawerSize = "sm" | "md"

export interface QdsDrawerApiProps
  extends Pick<QdsDialogApiProps, "scrollBehavior"> {
  /**
   * The horizontal placement of the drawer within the viewport.
   *
   * @default 'end'
   */
  placement?: QdsDrawerPlacement

  /**
   * The size of the drawer's width, font sizes, and internal spacing.
   *
   * @default 'sm'
   */
  size?: QdsDialogSize
}

type DrawerClasses = typeof drawerClasses

export interface QdsDrawerContentBindings {
  className: DrawerClasses["content"]
  "data-placement": QdsDrawerPlacement
  "data-size": QdsDrawerSize
}

export interface QdsDrawerPositionerBindings {
  className: DrawerClasses["positioner"]
  "data-placement": QdsDrawerPlacement
}

export interface QdsDrawerApi {
  placement: QdsDrawerPlacement
  size: QdsDrawerSize

  // group: bindings
  getContentBindings(): QdsDrawerContentBindings
  getPositionerBindings(): QdsDrawerPositionerBindings
}
