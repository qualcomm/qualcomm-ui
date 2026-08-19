// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {listboxClasses} from "./listbox.classes.js"
import type {
  QdsListboxApi,
  QdsListboxApiProps,
  QdsListboxContentBindings,
  QdsListboxItemBindings,
  QdsListboxLabelBindings,
  QdsListboxRootBindings,
} from "./listbox.types.js"

export function createQdsListboxApi(
  props: QdsListboxApiProps,
  normalize: PropNormalizer,
): QdsListboxApi {
  const size = props.size || "sm"

  return {
    size,

    // group: bindings
    getContentBindings(): QdsListboxContentBindings {
      return normalize.element({className: listboxClasses.content})
    },
    getItemBindings(): QdsListboxItemBindings {
      return normalize.element({
        className: listboxClasses.item,
        "data-size": size,
      })
    },
    getLabelBindings(): QdsListboxLabelBindings {
      return normalize.element({
        className: listboxClasses.label,
        "data-size": size,
      })
    },
    getRootBindings(): QdsListboxRootBindings {
      return normalize.element({
        className: listboxClasses.root,
        "data-size": size,
      })
    },
  }
}
