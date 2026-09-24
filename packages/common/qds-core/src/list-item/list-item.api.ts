// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {qdsListItemAnatomy} from "./list-item.anatomy.js"
import {listItemClasses} from "./list-item.classes.js"
import type {
  QdsListItemAccessoryBindings,
  QdsListItemApi,
  QdsListItemApiProps,
  QdsListItemControlBindings,
  QdsListItemDescriptionBindings,
  QdsListItemLabelBindings,
  QdsListItemRootBindings,
  QdsListItemSecondaryTextBindings,
  QdsListItemStartIconBindings,
} from "./list-item.types.js"

const parts = qdsListItemAnatomy.parts

export function createQdsListItemApi(
  props: QdsListItemApiProps,
  normalize: PropNormalizer,
): QdsListItemApi {
  const disabled = !!props.disabled
  const size = props.size || "md"
  const interactive = props.interactive || false

  return {
    disabled,
    interactive,
    size,

    // group: bindings
    getAccessoryBindings(): QdsListItemAccessoryBindings {
      return normalize.element({
        ...parts.accessory,
        className: listItemClasses.accessory,
        "data-disabled": booleanDataAttr(disabled),
        "data-size": size,
      })
    },
    getControlBindings(): QdsListItemControlBindings {
      return normalize.element({
        ...parts.control,
        className: listItemClasses.control,
        "data-disabled": booleanDataAttr(disabled),
        "data-size": size,
      })
    },
    getDescriptionBindings(): QdsListItemDescriptionBindings {
      return normalize.element({
        ...parts.description,
        className: listItemClasses.description,
        "data-disabled": booleanDataAttr(disabled),
      })
    },
    getLabelBindings(): QdsListItemLabelBindings {
      return normalize.element({
        ...parts.label,
        className: listItemClasses.label,
        "data-disabled": booleanDataAttr(disabled),
        "data-size": size,
      })
    },
    getRootBindings(): QdsListItemRootBindings {
      return normalize.element({
        ...parts.root,
        className: listItemClasses.root,
        "data-disabled": booleanDataAttr(disabled),
        "data-interactive": booleanDataAttr(interactive),
        "data-size": size,
      })
    },
    getSecondaryTextBindings(): QdsListItemSecondaryTextBindings {
      return normalize.element({
        ...parts.secondaryText,
        className: listItemClasses.secondaryText,
        "data-disabled": booleanDataAttr(disabled),
      })
    },
    getStartIconBindings(): QdsListItemStartIconBindings {
      return normalize.element({
        ...parts.startIcon,
        className: listItemClasses.startIcon,
        "data-disabled": booleanDataAttr(disabled),
        "data-size": size,
      })
    },
  }
}
