// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsButtonApiProps} from "@qualcomm-ui/qds-core/button"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {filterPanelClasses} from "./filter-panel.classes.js"
import type {
  QdsFilterPanelApi,
  QdsFilterPanelApiProps,
  QdsFilterPanelApplyTriggerBindings,
  QdsFilterPanelClearTriggerBindings,
  QdsFilterPanelCloseTriggerBindings,
  QdsFilterPanelFooterBindings,
  QdsFilterPanelHeaderBindings,
  QdsFilterPanelHeadingBindings,
  QdsFilterPanelRootBindings,
  QdsFilterPanelSectionBindings,
} from "./filter-panel.types.js"

export function createQdsFilterPanelApi(
  props: Explicit<QdsFilterPanelApiProps>,
  normalize: PropNormalizer,
): QdsFilterPanelApi {
  const size = props.size || "md"

  return {
    getButtonProps(): QdsButtonApiProps {
      return {
        density: "compact",
        size: size === "lg" ? "md" : "sm",
      }
    },

    size,

    // group: bindings
    getApplyTriggerBindings(): QdsFilterPanelApplyTriggerBindings {
      return normalize.button({className: filterPanelClasses.applyTrigger})
    },
    getClearTriggerBindings(): QdsFilterPanelClearTriggerBindings {
      return normalize.button({className: filterPanelClasses.clearTrigger})
    },
    getCloseTriggerBindings(): QdsFilterPanelCloseTriggerBindings {
      return normalize.button({
        "aria-label": "Close filters",
        className: filterPanelClasses.closeTrigger,
        type: "button",
      })
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
