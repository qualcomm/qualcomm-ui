// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {checkboxClasses} from "@qualcomm-ui/qds-core/checkbox"
import {radioClasses} from "@qualcomm-ui/qds-core/radio"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {menuItemClasses} from "./menu-item.classes"
import {menuClasses} from "./menu.classes"
import type {
  QdsMenuApi,
  QdsMenuApiProps,
  QdsMenuButtonBindings,
  QdsMenuCheckboxItemControlBindings,
  QdsMenuContentBindings,
  QdsMenuDescriptionBindings,
  QdsMenuItemAccessoryBindings,
  QdsMenuItemBindings,
  QdsMenuItemCommandBindings,
  QdsMenuItemGroupBindings,
  QdsMenuItemGroupLabelBindings,
  QdsMenuItemIndicatorBindings,
  QdsMenuItemLabelBindings,
  QdsMenuItemStartIconBindings,
  QdsMenuRadioItemBindings,
  QdsMenuRadioItemControlBindings,
  QdsMenuSeparatorBindings,
  QdsMenuTriggerItemIndicatorBindings,
} from "./menu.types"

export function createQdsMenuApi(
  props: QdsMenuApiProps,
  normalize: PropNormalizer,
): QdsMenuApi {
  const size = props.size || "md"
  return {
    size,

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
        className: menuItemClasses.startIcon,
        "data-part": "start-icon",
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
        className: menuItemClasses.itemDescription,
        "data-part": "description",
        "data-scope": "menu",
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
