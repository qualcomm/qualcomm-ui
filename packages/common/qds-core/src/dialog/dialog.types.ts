// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {dialogClasses} from "./dialog.classes"

export type QdsDialogSize = "sm" | "md"

export type QdsDialogEmphasis =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "neutral"

export type QdsDialogScrollBehavior = "inside" | "outside"

export type QdsDialogPlacement = "top" | "center" | "bottom"

export interface QdsDialogApiProps {
  /**
   * The style variant of the dialog's indicator.
   *
   * @default 'neutral'
   */
  emphasis?: QdsDialogEmphasis

  /**
   * The vertical placement of the dialog within the viewport.
   *
   * @option `'top'`: The dialog is positioned at the top of the viewport.
   * @option `'center'`: The dialog is positioned at the center of the viewport.
   * @option `'bottom'`: The dialog is positioned at the bottom of the viewport.
   *
   * @default 'top'
   */
  placement?: QdsDialogPlacement

  /**
   * Defines the scroll behavior of the dialog content when modal content exceeds
   * viewport height.
   *
   * @option `'inside'`: The modal and backdrop create an internal scroll area within the modal.
   * @option `'outside'`: The modal and backdrop move with the page scroll instead of creating an internal scroll area within the modal.
   *
   * @default 'outside'
   */
  scrollBehavior?: QdsDialogScrollBehavior

  /**
   * The size of the dialog's content area and fonts. A smaller size uses less
   * horizontal space.
   *
   * @default 'sm'
   */
  size?: QdsDialogSize
}

type DialogClasses = typeof dialogClasses

export interface QdsDialogContentBindings {
  className: DialogClasses["content"]
  "data-scroll-behavior": QdsDialogScrollBehavior
  "data-size": QdsDialogSize
}

export interface QdsDialogIndicatorIconBindings {
  className: DialogClasses["indicatorIcon"]
  "data-emphasis": QdsDialogEmphasis
  "data-size": QdsDialogSize
}

export interface QdsDialogHeadingBindings {
  className: DialogClasses["heading"]
  "data-size": QdsDialogSize
}

export interface QdsDialogBodyBindings {
  className: DialogClasses["body"]
  "data-size": QdsDialogSize
}

export interface QdsDialogFooterBindings {
  className: DialogClasses["footer"]
  "data-size": QdsDialogSize
}

export interface QdsDialogCloseButtonBindings {
  className: DialogClasses["closeButton"]
}

export interface QdsDialogPositionerBindings {
  className: DialogClasses["positioner"]
  "data-placement": QdsDialogPlacement
  "data-scroll-behavior": QdsDialogScrollBehavior
  "data-size": QdsDialogSize
}

export interface QdsDialogBackdropBindings {
  className: DialogClasses["backdrop"]
}

export interface QdsDialogApi {
  emphasis: QdsDialogEmphasis
  size: QdsDialogSize

  // group: bindings
  getBackdropBindings(): QdsDialogBackdropBindings
  getBodyBindings(): QdsDialogBodyBindings
  getCloseButtonBindings(): QdsDialogCloseButtonBindings
  getContentBindings(): QdsDialogContentBindings
  getFooterBindings(): QdsDialogFooterBindings
  getHeadingBindings(): QdsDialogHeadingBindings
  getIndicatorIconBindings(): QdsDialogIndicatorIconBindings
  getPositionerBindings(): QdsDialogPositionerBindings
}
