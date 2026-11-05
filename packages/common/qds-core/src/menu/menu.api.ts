// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsButtonApiProps} from "@qualcomm-ui/qds-core/button"
import {checkboxClasses} from "@qualcomm-ui/qds-core/checkbox"
import {radioClasses} from "@qualcomm-ui/qds-core/radio"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {menuItemClasses} from "./menu-item.classes.js"
import {qdsMenuAnatomy} from "./menu.anatomy.js"
import {menuClasses} from "./menu.classes.js"
import type {
  QdsMenuApi,
  QdsMenuApiProps,
  QdsMenuButtonBindings,
  QdsMenuCheckboxItemControlBindings,
  QdsMenuContentBindings,
  QdsMenuDescriptionBindings,
  QdsMenuFooterBindings,
  QdsMenuHeaderBindings,
  QdsMenuHeaderLabelBindings,
  QdsMenuIndicatorBindings,
  QdsMenuItemAccessoryBindings,
  QdsMenuItemBindings,
  QdsMenuItemCommandBindings,
  QdsMenuItemGroupBindings,
  QdsMenuItemGroupLabelBindings,
  QdsMenuItemIndicatorBindings,
  QdsMenuItemLabelBindings,
  QdsMenuItemStartIconBindings,
  QdsMenuPositionerBindings,
  QdsMenuRadioItemBindings,
  QdsMenuRadioItemControlBindings,
  QdsMenuSeparatorBindings,
  QdsMenuTriggerItemIndicatorBindings,
} from "./menu.types.js"

export function createQdsMenuApi(
  props: QdsMenuApiProps,
  normalize: PropNormalizer,
): QdsMenuApi {
  const size = props.size || "md"
  const parts = qdsMenuAnatomy.parts
  return {
    size,

    // group: prop translations
    getFooterButtonProps(): QdsButtonApiProps {
      return {density: "compact", size: size === "sm" ? "md" : "lg"}
    },
    getHeaderButtonProps(): QdsButtonApiProps {
      return {density: "compact", size, variant: "ghost"}
    },

    // group: bindings
    getButtonBindings(): QdsMenuButtonBindings {
      return normalize.element({
        className: menuClasses.button,
      })
    },
    getCheckboxItemControlBindings(): QdsMenuCheckboxItemControlBindings {
      return normalize.element({
        className: checkboxClasses.control,
      })
    },
    getContentBindings(): QdsMenuContentBindings {
      return normalize.element({
        className: menuClasses.content,
        "data-size": size,
      })
    },
    getFooterBindings(): QdsMenuFooterBindings {
      return normalize.element({
        ...parts.footer,
        className: menuClasses.footer,
        "data-size": size,
      })
    },
    getHeaderBindings(): QdsMenuHeaderBindings {
      return normalize.element({
        ...parts.header,
        className: menuClasses.header,
        "data-size": size,
      })
    },
    getHeaderLabelBindings(): QdsMenuHeaderLabelBindings {
      return normalize.element({
        ...parts.headerLabel,
        className: menuClasses.headerLabel,
        "data-size": size,
      })
    },
    getIndicatorBindings(): QdsMenuIndicatorBindings {
      return normalize.element({
        className: menuClasses.indicator,
      })
    },
    getItemBindings(): QdsMenuItemBindings {
      return normalize.element({
        className: menuItemClasses.root,
        "data-size": size,
      })
    },
    getItemCommandBindings(): QdsMenuItemCommandBindings {
      return normalize.element({
        className: menuItemClasses.command,
        "data-size": size,
      })
    },
    getItemGroupBindings(): QdsMenuItemGroupBindings {
      return normalize.element({
        className: menuItemClasses.group,
      })
    },
    getItemGroupLabelBindings(): QdsMenuItemGroupLabelBindings {
      return normalize.element({
        className: menuItemClasses.groupLabel,
        "data-size": size,
      })
    },
    getItemIndicatorBindings(): QdsMenuItemIndicatorBindings {
      return normalize.element({
        className: menuItemClasses.itemIndicator,
        "data-size": size,
      })
    },
    getItemLabelBindings(): QdsMenuItemLabelBindings {
      return normalize.element({
        className: menuItemClasses.itemLabel,
        "data-size": size,
      })
    },
    getItemStartIconBindings(): QdsMenuItemStartIconBindings {
      return normalize.element({
        ...parts.startIcon,
        className: menuItemClasses.startIcon,
        "data-size": size,
      })
    },
    getMenuItemAccessoryBindings(): QdsMenuItemAccessoryBindings {
      return normalize.element({
        className: menuItemClasses.itemAccessory,
      })
    },
    getMenuItemDescriptionBindings(): QdsMenuDescriptionBindings {
      return normalize.element({
        ...parts.description,
        className: menuItemClasses.itemDescription,
        "data-size": size,
      })
    },
    getPositionerBindings(): QdsMenuPositionerBindings {
      return normalize.element({
        className: menuClasses.positioner,
        "data-size": size,
      })
    },
    getRadioItemBindings(): QdsMenuRadioItemBindings {
      return normalize.element({
        className: menuItemClasses.root,
        "data-size": size,
      })
    },
    getRadioItemControlBindings(): QdsMenuRadioItemControlBindings {
      return normalize.element({
        className: radioClasses.itemControl,
      })
    },
    getSeparatorBindings(): QdsMenuSeparatorBindings {
      return normalize.element({
        className: menuClasses.separator,
      })
    },
    getTriggerItemIndicatorBindings(): QdsMenuTriggerItemIndicatorBindings {
      return normalize.element({
        className: menuItemClasses.itemIndicator,
        "data-size": size,
      })
    },
  }
}
