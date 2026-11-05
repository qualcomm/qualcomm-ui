// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {linkAnatomy} from "./link.anatomy.js"
import {linkClasses} from "./link.classes.js"
import type {
  QdsLinkApi,
  QdsLinkApiProps,
  QdsLinkEndIconBindings,
  QdsLinkRootBindings,
  QdsLinkStartIconBindings,
} from "./link.types.js"

export function createQdsLinkApi(
  props: QdsLinkApiProps,
  normalize: PropNormalizer,
): QdsLinkApi {
  const emphasis = props.emphasis || "default"
  const size = props.size || "sm"

  return {
    emphasis,
    size,

    // group: bindings
    getEndIconBindings(): QdsLinkEndIconBindings {
      return normalize.element({
        ...linkAnatomy.parts.icon,
        className: linkClasses.icon,
        "data-placement": "end",
        "data-size": size,
      })
    },
    getRootBindings(): QdsLinkRootBindings {
      return normalize.element({
        ...linkAnatomy.parts.root,
        className: linkClasses.root,
        "data-disabled": booleanDataAttr(props.disabled),
        "data-emphasis": emphasis,
        "data-inherit-font-size": booleanDataAttr(props.inheritFontSize),
        "data-size": size,
        dir: props.dir || "ltr",
      })
    },
    getStartIconBindings(): QdsLinkStartIconBindings {
      return normalize.element({
        ...linkAnatomy.parts.icon,
        className: linkClasses.icon,
        "data-placement": "start",
        "data-size": size,
      })
    },
  }
}
