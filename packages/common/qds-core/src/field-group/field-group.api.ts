// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {fieldGroupClasses} from "./field-group.classes"
import type {
  QdsFieldGroupApi,
  QdsFieldGroupApiProps,
  QdsFieldGroupErrorTextBindings,
  QdsFieldGroupHintBindings,
  QdsFieldGroupItemsBindings,
  QdsFieldGroupLabelBindings,
  QdsFieldGroupRootBindings,
} from "./field-group.types"

const commonBindings = {
  "data-scope": "field-group",
} as const

export function createQdsFieldGroupApi(
  props: Explicit<QdsFieldGroupApiProps>,
  normalize: PropNormalizer,
): QdsFieldGroupApi {
  const size = props.size ?? "md"
  const orientation = props.orientation ?? "vertical"
  const indented = props.indented ?? false
  const invalid = props.invalid ?? false

  return {
    getErrorTextBindings(): QdsFieldGroupErrorTextBindings {
      return normalize.element({
        ...commonBindings,
        className: fieldGroupClasses.errorText,
        "data-part": "error-text",
      })
    },
    getHintBindings(): QdsFieldGroupHintBindings {
      return normalize.element({
        ...commonBindings,
        className: fieldGroupClasses.hint,
        "data-part": "hint",
      })
    },
    getItemsBindings(): QdsFieldGroupItemsBindings {
      return normalize.element({
        ...commonBindings,
        className: fieldGroupClasses.items,
        "data-indented": booleanDataAttr(indented),
        "data-orientation": orientation,
        "data-part": "items",
        "data-size": size,
      })
    },
    getLabelBindings(): QdsFieldGroupLabelBindings {
      return normalize.element({
        ...commonBindings,
        className: fieldGroupClasses.label,
        "data-part": "label",
      })
    },
    getRootBindings(): QdsFieldGroupRootBindings {
      return normalize.element({
        ...commonBindings,
        className: fieldGroupClasses.root,
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "root",
      })
    },

    indented,
    invalid,
    orientation,
    size,
  }
}
