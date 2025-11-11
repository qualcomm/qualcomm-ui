// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {selectClasses} from "./select.classes"
import type {
  QdsSelectApi,
  QdsSelectApiProps,
  QdsSelectClearTriggerBindings,
  QdsSelectContentBindings,
  QdsSelectControlBindings,
  QdsSelectHiddenSelectBindings,
  QdsSelectIconBindings,
  QdsSelectIndicatorBindings,
  QdsSelectItemBindings,
  QdsSelectItemIndicatorBindings,
  QdsSelectItemTextBindings,
  QdsSelectLabelBindings,
  QdsSelectPositionerBindings,
  QdsSelectRootBindings,
  QdsSelectValueTextBindings,
} from "./select.types"

export function createQdsSelectApi(
  props: QdsSelectApiProps,
  normalize: PropNormalizer,
): QdsSelectApi {
  const size = props.size || "md"
  return {
    size,

    // group: bindings
    getClearTriggerBindings(): QdsSelectClearTriggerBindings {
      return normalize.element({
        className: selectClasses.clearTrigger,
        "data-size": size,
      })
    },
    getContentBindings(): QdsSelectContentBindings {
      return normalize.element({
        className: selectClasses.content,
      })
    },
    getControlBindings(): QdsSelectControlBindings {
      return normalize.element({
        className: selectClasses.control,
        "data-size": size,
      })
    },
    getHiddenSelectBindings(): QdsSelectHiddenSelectBindings {
      return normalize.select({
        className: selectClasses.hiddenSelect,
      })
    },
    getIconBindings(): QdsSelectIconBindings {
      return normalize.element({
        className: selectClasses.icon,
        "data-size": size,
      })
    },
    getIndicatorBindings(): QdsSelectIndicatorBindings {
      return normalize.element({
        className: selectClasses.indicator,
        "data-size": size,
      })
    },
    getItemBindings(): QdsSelectItemBindings {
      return normalize.element({
        className: selectClasses.item,
        "data-size": size,
      })
    },
    getItemIndicatorBindings(): QdsSelectItemIndicatorBindings {
      return normalize.element({
        className: selectClasses.itemIndicator,
      })
    },
    getItemTextBindings(): QdsSelectItemTextBindings {
      return normalize.element({
        className: selectClasses.itemText,
      })
    },
    getLabelBindings(): QdsSelectLabelBindings {
      return normalize.element({
        className: selectClasses.label,
      })
    },
    getPositionerBindings(): QdsSelectPositionerBindings {
      return normalize.element({
        className: selectClasses.positioner,
      })
    },
    getRootBindings(): QdsSelectRootBindings {
      return normalize.element({
        className: selectClasses.root,
        "data-size": size,
      })
    },
    getValueTextBindings(): QdsSelectValueTextBindings {
      return normalize.element({
        className: selectClasses.valueText,
        "data-size": size,
      })
    },
  }
}
