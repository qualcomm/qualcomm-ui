// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {popoverClasses} from "./popover.classes.js"

export type QdsPopoverEmphasis = "neutral" | "brand"

export interface QdsPopoverApiProps {
  /**
   * The style variant of the popover.
   *
   * @option `'neutral'`: neutral overlay background with dark text.
   * @option `'brand'`: brand primary background with white text.
   *
   * @default 'neutral'
   */
  emphasis?: QdsPopoverEmphasis
}

type PopoverClasses = typeof popoverClasses

export interface QdsPopoverContentBindings {
  className: PopoverClasses["content"]
  "data-emphasis": QdsPopoverEmphasis
}

export interface QdsPopoverArrowBindings {
  className: PopoverClasses["arrow"]
  "data-emphasis": QdsPopoverEmphasis
}

export interface QdsPopoverApi {
  emphasis: QdsPopoverEmphasis

  getArrowBindings(): QdsPopoverArrowBindings
  getContentBindings(): QdsPopoverContentBindings
}
