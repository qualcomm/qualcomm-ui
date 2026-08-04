// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"

import type {
  QdsButtonGroupCommonBindings,
  QdsButtonGroupCommonProps,
} from "./button-group-shared.types.js"
import type {buttonGroupAnatomy} from "./button-group.anatomy.js"
import type {buttonClasses} from "./button.classes.js"

/**
 * The button group layouts
 */
export type QdsButtonGroupLayout = "hug" | "start" | "end" | "fill"

export interface QdsButtonGroupApiProps extends QdsButtonGroupCommonProps {
  /**
   * The layout used to display the button group.
   * - `hug`: Content-sized; width matches the buttons only (default).
   * - `start`: Full width; buttons are aligned to the start edge.
   * - `end`: Full width; buttons are aligned to the end edge.
   * - `fill`: Full width; buttons share space evenly.
   *
   * @default 'hug'
   */
  layout?: QdsButtonGroupLayout
}

type PartName = AnatomyPartName<typeof buttonGroupAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"buttonGroup", P> {}

export interface QdsButtonGroupBindings
  extends Part<"root">, QdsButtonGroupCommonBindings {
  className: (typeof buttonClasses)["group"]
  "data-layout": QdsButtonGroupLayout
}
