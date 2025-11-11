// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {checkboxClasses} from "@qualcomm-ui/qds-core/checkbox"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {checkmarkClasses} from "./checkmark.classes"
import type {
  QdsCheckmarkApi,
  QdsCheckmarkApiProps,
  QdsCheckmarkIconBindings,
  QdsCheckmarkRootBindings,
} from "./checkmark.types"

export function createQdsCheckmarkApi(
  props: Explicit<QdsCheckmarkApiProps>,
  normalize: PropNormalizer,
): QdsCheckmarkApi {
  return {
    getIconBindings(): QdsCheckmarkIconBindings {
      return normalize.element({
        className: checkmarkClasses.icon,
        hidden: !props.checked && !props.indeterminate,
      })
    },
    getRootBindings(): QdsCheckmarkRootBindings {
      return normalize.element({
        className: `${checkboxClasses.control} ${checkmarkClasses.root}`,
        "data-disabled": booleanDataAttr(props.disabled),
        "data-state": props.checked
          ? "checked"
          : props.indeterminate
            ? "indeterminate"
            : "unchecked",
      })
    },
  }
}
