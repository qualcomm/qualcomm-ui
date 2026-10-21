// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {jsonViewerClasses} from "./json-viewer.classes"
import type {
  QdsJsonViewerApi,
  QdsJsonViewerColonBindings,
  QdsJsonViewerKeyBindingProps,
  QdsJsonViewerKeyBindings,
  QdsJsonViewerValueBindingProps,
  QdsJsonViewerValueBindings,
} from "./json-viewer.types"

export function createQdsJsonViewerApi(
  normalize: PropNormalizer,
): QdsJsonViewerApi {
  return {
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
      return normalize.element({
        className: props.root ? jsonViewerClasses.value : undefined,
        "data-kind": props.kind,
        "data-root": booleanDataAttr(props.root),
        "data-type": props.nodeType,
      })
    },
  }
}
