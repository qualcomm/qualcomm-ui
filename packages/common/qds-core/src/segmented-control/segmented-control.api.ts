// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {segmentedControlClasses} from "./segmented-control.classes"
import type {
  QdsSegmentedControlApi,
  QdsSegmentedControlApiProps,
  QdsSegmentedControlGroupBindings,
  QdsSegmentedControlItemBindings,
  QdsSegmentedControlItemHiddenInputBindings,
  QdsSegmentedControlItemTextBindings,
} from "./segmented-control.types"

export function createQdsSegmentedControlApi(
  props: Explicit<QdsSegmentedControlApiProps>,
  normalize: PropNormalizer,
): QdsSegmentedControlApi {
  const size = props.size || "md"
  const layout = props.layout || "hug"
  const variant = props.variant || "primary"
  return {
    layout,
    size,
    variant,

    // group: bindings
    getGroupBindings(): QdsSegmentedControlGroupBindings {
      return normalize.element({
        className: segmentedControlClasses.group,
        "data-layout": layout,
        "data-size": size,
        "data-variant": variant,
      })
    },
    getItemBindings(): QdsSegmentedControlItemBindings {
      return normalize.element({
        className: segmentedControlClasses.item,
      })
    },
    getItemHiddenInputBindings(): QdsSegmentedControlItemHiddenInputBindings {
      return normalize.element({
        className: segmentedControlClasses.itemHiddenInput,
      })
    },
    getItemTextBindings(): QdsSegmentedControlItemTextBindings {
      return normalize.element({
        className: segmentedControlClasses.itemText,
      })
    },
  }
}
