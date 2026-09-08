// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {
  JsonNodeSyntaxKind,
  JsonNodeType,
} from "@qualcomm-ui/utils/json-tree"

import type {jsonViewerClasses} from "./json-viewer.classes"

type JsonViewerClasses = typeof jsonViewerClasses

export interface QdsJsonViewerValueBindingProps {
  kind?: JsonNodeSyntaxKind
  nodeType?: JsonNodeType
  root?: boolean
}

export interface QdsJsonViewerKeyBindingProps {
  isNonEnumerable?: boolean
}

export interface QdsJsonViewerValueBindings {
  className: JsonViewerClasses["value"] | undefined
  "data-kind"?: JsonNodeSyntaxKind
  "data-root"?: BooleanDataAttr
  "data-type"?: JsonNodeType
}

export interface QdsJsonViewerKeyBindings {
  className: JsonViewerClasses["key"]
  "data-non-enumerable"?: BooleanDataAttr
}

export interface QdsJsonViewerColonBindings {
  className: JsonViewerClasses["colon"]
}

export interface QdsJsonViewerApi {
  getColonBindings(): QdsJsonViewerColonBindings
  getKeyBindings(props: QdsJsonViewerKeyBindingProps): QdsJsonViewerKeyBindings
  getValueBindings(
    props: QdsJsonViewerValueBindingProps,
  ): QdsJsonViewerValueBindings
}
