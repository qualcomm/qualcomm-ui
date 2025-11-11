// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {linkClasses} from "./link.classes"
import type {
  QdsLinkApi,
  QdsLinkApiProps,
  QdsLinkEndIconBindings,
  QdsLinkRootBindings,
  QdsLinkScope,
  QdsLinkStartIconBindings,
} from "./link.types"

export function createQdsLinkApi(
  props: QdsLinkApiProps,
  normalize: PropNormalizer,
): QdsLinkApi {
  const scope: QdsLinkScope = {
    "data-scope": "link",
    dir: props.dir || "ltr",
  }

  const emphasis = props.emphasis || "default"
  const size = props.size || "sm"

  return {
    emphasis,
    size,

    // group: bindings
    getEndIconBindings(): QdsLinkEndIconBindings {
      return normalize.element({
        ...scope,
        className: linkClasses.icon,
        "data-part": "icon",
        "data-placement": "end",
        "data-size": size,
      })
    },
    getRootBindings(): QdsLinkRootBindings {
      return normalize.element({
        ...scope,
        className: linkClasses.root,
        "data-disabled": booleanDataAttr(props.disabled),
        "data-emphasis": emphasis,
        "data-part": "root",
        "data-size": size,
      })
    },
    getStartIconBindings(): QdsLinkStartIconBindings {
      return normalize.element({
        ...scope,
        className: linkClasses.icon,
        "data-part": "icon",
        "data-placement": "start",
        "data-size": size,
      })
    },
  }
}
