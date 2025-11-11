// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {defined, type Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {tabClasses, tabsClasses} from "./tabs.classes"
import type {
  QdsTabsApi,
  QdsTabsApiProps,
  QdsTabsIndicatorBindings,
  QdsTabsListBindings,
  QdsTabsPanelBindings,
  QdsTabsRootBindings,
  QdsTabsTabBindings,
  QdsTabsTabButtonBindings,
  QdsTabsTabDismissButtonBindings,
  QdsTabsTabEndIconBindings,
  QdsTabsTabStartIconBindings,
} from "./tabs.types"

export function createQdsTabsApi(
  props: Explicit<QdsTabsApiProps>,
  normalize: PropNormalizer,
): QdsTabsApi {
  const size = props.size || "md"
  const variant = props.variant || "line"

  return {
    size,
    variant,

    // group: bindings
    getIndicatorBindings(): QdsTabsIndicatorBindings {
      return normalize.element({
        className: tabsClasses.indicator,
        "data-animate": booleanDataAttr(
          defined(props.animateIndicator) ? props.animateIndicator : true,
        ),
        "data-size": size,
        "data-variant": variant,
        hidden: variant === "contained",
      })
    },
    getListBindings(): QdsTabsListBindings {
      return normalize.element({
        className: tabsClasses.list,
        "data-size": size,
        "data-variant": variant,
      })
    },
    getPanelBindings(): QdsTabsPanelBindings {
      return normalize.element({
        className: tabsClasses.panel,
      })
    },
    getRootBindings(): QdsTabsRootBindings {
      return normalize.element({
        className: tabsClasses.root,
        "data-size": size,
      })
    },
    getTabBindings(): QdsTabsTabBindings {
      return normalize.element({
        className: tabClasses.root,
        "data-size": size,
        "data-variant": variant,
      })
    },
    getTabButtonBindings(): QdsTabsTabButtonBindings {
      return normalize.button({
        className: tabClasses.button,
        "data-size": size,
        "data-variant": variant,
      })
    },
    getTabDismissButtonBindings(): QdsTabsTabDismissButtonBindings {
      return normalize.button({
        className: tabClasses.dismissButton,
        "data-size": size,
      })
    },
    getTabEndIconBindings(): QdsTabsTabEndIconBindings {
      const iconVariant = props.iconVariant || "ghost"
      return normalize.element({
        className: tabClasses.icon,
        "data-icon-variant": iconVariant,
        "data-placement": "end",
        "data-size": size,
        "data-variant": variant,
      })
    },
    getTabStartIconBindings(): QdsTabsTabStartIconBindings {
      const iconVariant = props.iconVariant || "ghost"
      return normalize.element({
        className: tabClasses.icon,
        "data-icon-variant": iconVariant,
        "data-placement": "start",
        "data-size": size,
        "data-variant": variant,
      })
    },
  }
}
