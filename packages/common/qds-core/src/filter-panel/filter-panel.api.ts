// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsNumberBadgeProps} from "@qualcomm-ui/qds-core/badge"
import type {QdsButtonApiProps} from "@qualcomm-ui/qds-core/button"
import type {QdsIconApiProps} from "@qualcomm-ui/qds-core/icon"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {filterPanelClasses} from "./filter-panel.classes.js"
import type {
  QdsFilterPanelApi,
  QdsFilterPanelApiProps,
  QdsFilterPanelApplyButtonBindings,
  QdsFilterPanelClearButtonBindings,
  QdsFilterPanelCloseButtonBindings,
  QdsFilterPanelCountBindings,
  QdsFilterPanelFilterBindings,
  QdsFilterPanelFilterContentBindings,
  QdsFilterPanelFilterCountBindings,
  QdsFilterPanelFilterIndicatorBindings,
  QdsFilterPanelFilterLabelBindings,
  QdsFilterPanelFilterTriggerBindings,
  QdsFilterPanelFooterBindings,
  QdsFilterPanelHeaderBindings,
  QdsFilterPanelHeadingBindings,
  QdsFilterPanelOptionGroupBindings,
  QdsFilterPanelRootBindings,
  QdsFilterPanelSectionBindings,
} from "./filter-panel.types.js"

export function createQdsFilterPanelApi(
  props: Explicit<QdsFilterPanelApiProps>,
  normalize: PropNormalizer,
): QdsFilterPanelApi {
  const size = props.size || "md"
  const controlSize = size === "lg" ? "md" : "sm"

  return {
    controlSize,

    getApplyButtonProps(): QdsButtonApiProps {
      return size === "lg"
        ? {density: "default", size: "sm"}
        : {density: "compact", size: "lg"}
    },
    getButtonProps(): QdsButtonApiProps {
      return {
        density: "compact",
        size: size === "lg" ? "lg" : "md",
      }
    },
    getCountBadgeProps(): QdsNumberBadgeProps {
      return {emphasis: "brand", size: "xs"}
    },
    getFilterCountBadgeProps(): QdsNumberBadgeProps {
      return {emphasis: "neutral-outline", size: "xs"}
    },
    getIconProps(): QdsIconApiProps {
      return {size: size === "lg" ? "md" : "xs"}
    },

    size,

    // group: bindings
    getApplyButtonBindings(): QdsFilterPanelApplyButtonBindings {
      return normalize.button({className: filterPanelClasses.applyButton})
    },
    getClearButtonBindings(): QdsFilterPanelClearButtonBindings {
      return normalize.button({className: filterPanelClasses.clearButton})
    },
    getCloseButtonBindings(): QdsFilterPanelCloseButtonBindings {
      return normalize.button({
        "aria-label": "Close filters",
        className: filterPanelClasses.closeButton,
        type: "button",
      })
    },
    getCountBindings(): QdsFilterPanelCountBindings {
      return normalize.element({className: filterPanelClasses.count})
    },
    getFilterBindings(): QdsFilterPanelFilterBindings {
      return normalize.element({className: filterPanelClasses.filter})
    },
    getFilterContentBindings(): QdsFilterPanelFilterContentBindings {
      return normalize.element({className: filterPanelClasses.filterContent})
    },
    getFilterCountBindings(): QdsFilterPanelFilterCountBindings {
      return normalize.element({className: filterPanelClasses.filterCount})
    },
    getFilterIndicatorBindings(): QdsFilterPanelFilterIndicatorBindings {
      return normalize.element({className: filterPanelClasses.filterIndicator})
    },
    getFilterLabelBindings(): QdsFilterPanelFilterLabelBindings {
      return normalize.element({className: filterPanelClasses.filterLabel})
    },
    getFilterTriggerBindings(): QdsFilterPanelFilterTriggerBindings {
      return normalize.button({className: filterPanelClasses.filterTrigger})
    },
    getFooterBindings(): QdsFilterPanelFooterBindings {
      return normalize.element({className: filterPanelClasses.footer})
    },
    getHeaderBindings(): QdsFilterPanelHeaderBindings {
      return normalize.element({className: filterPanelClasses.header})
    },
    getHeadingBindings(): QdsFilterPanelHeadingBindings {
      return normalize.element({className: filterPanelClasses.heading})
    },
    getOptionGroupBindings(): QdsFilterPanelOptionGroupBindings {
      return normalize.element({className: filterPanelClasses.optionGroup})
    },
    getRootBindings(): QdsFilterPanelRootBindings {
      return normalize.element({
        className: filterPanelClasses.root,
        "data-size": size,
      })
    },
    getSectionBindings(): QdsFilterPanelSectionBindings {
      return normalize.element({className: filterPanelClasses.section})
    },
  }
}
