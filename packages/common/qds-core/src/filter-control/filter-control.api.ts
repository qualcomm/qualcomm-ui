// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {filterControlClasses} from "./filter-control.classes.js"
import type {
  QdsFilterControlApi,
  QdsFilterControlApiProps,
  QdsFilterControlOptionCountBindings,
  QdsFilterControlOptionGroupBindings,
  QdsFilterControlOptionLabelBindings,
} from "./filter-control.types.js"

export function createQdsFilterControlApi(
  props: Explicit<QdsFilterControlApiProps>,
  normalize: PropNormalizer,
): QdsFilterControlApi {
  const size = props.size || "sm"

  return {
    size,

    // group: bindings
    getOptionCountBindings(): QdsFilterControlOptionCountBindings {
      return normalize.element({className: filterControlClasses.optionCount})
    },
    getOptionGroupBindings(): QdsFilterControlOptionGroupBindings {
      return normalize.element({
        className: filterControlClasses.optionGroup,
        "data-size": size,
      })
    },
    getOptionLabelBindings(): QdsFilterControlOptionLabelBindings {
      return normalize.element({className: filterControlClasses.optionLabel})
    },
  }
}
