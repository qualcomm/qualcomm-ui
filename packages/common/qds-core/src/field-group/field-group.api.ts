// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {fieldGroupAnatomy} from "./field-group.anatomy"
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

const parts = fieldGroupAnatomy.parts

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
        ...parts.errorText,
        className: fieldGroupClasses.errorText,
      })
    },
    getHintBindings(): QdsFieldGroupHintBindings {
      return normalize.element({
        ...parts.hint,
        className: fieldGroupClasses.hint,
      })
    },
    getItemsBindings(): QdsFieldGroupItemsBindings {
      return normalize.element({
        ...parts.items,
        className: fieldGroupClasses.items,
        "data-indented": booleanDataAttr(indented),
        "data-orientation": orientation,
        "data-size": size,
      })
    },
    getLabelBindings(): QdsFieldGroupLabelBindings {
      return normalize.element({
        ...parts.label,
        className: fieldGroupClasses.label,
      })
    },
    getRootBindings(): QdsFieldGroupRootBindings {
      return normalize.element({
        ...parts.root,
        className: fieldGroupClasses.root,
        "data-invalid": booleanDataAttr(invalid),
      })
    },

    indented,
    invalid,
    orientation,
    size,
  }
}
