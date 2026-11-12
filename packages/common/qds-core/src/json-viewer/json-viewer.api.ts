// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {jsonViewerClasses} from "./json-viewer.classes.js"
import type {
  QdsJsonViewerApi,
  QdsJsonViewerClosingBracketBindings,
  QdsJsonViewerColonBindings,
  QdsJsonViewerKeyBindingProps,
  QdsJsonViewerKeyBindings,
  QdsJsonViewerValueBindingProps,
  QdsJsonViewerValueBindings,
} from "./json-viewer.types.js"

export function createQdsJsonViewerApi(
  normalize: PropNormalizer,
): QdsJsonViewerApi {
  return {
    getClosingBracketBindings(): QdsJsonViewerClosingBracketBindings {
      return normalize.element({
        className: jsonViewerClasses.closingBracket,
      })
    },
    getColonBindings(): QdsJsonViewerColonBindings {
      return normalize.element({
        className: jsonViewerClasses.colon,
      })
    },
    getKeyBindings(
      props: QdsJsonViewerKeyBindingProps,
    ): QdsJsonViewerKeyBindings {
      return normalize.element({
        className: jsonViewerClasses.key,
        "data-non-enumerable": booleanDataAttr(props.isNonEnumerable),
      })
    },
    getValueBindings(
      props: QdsJsonViewerValueBindingProps,
    ): QdsJsonViewerValueBindings {
      const root = props.root || props.nodeType != null
      return normalize.element({
        ...(root ? {className: jsonViewerClasses.value} : {}),
        "data-kind": props.kind,
        "data-root": booleanDataAttr(root),
        "data-type": props.nodeType,
      })
    },
  }
}
