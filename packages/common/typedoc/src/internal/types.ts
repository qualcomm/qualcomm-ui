// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {JSONOutput} from "typedoc"

import type {QuiPropTypes, SerializedType} from "@qualcomm-ui/typedoc-common"

export interface TypeDetails extends Omit<QuiDeclarationReflection, "sources"> {
  url?: string
}

export interface QuiReflectionSymbolId extends JSONOutput.ReflectionSymbolId {
  decorators?: string[]
  details: TypeDetails
  resolvedType: SerializedType
}

export type KnownInterfaces = Record<string | number, QuiReflectionSymbolId>

export type QuiDeclarationReflection = Omit<
  JSONOutput.DeclarationReflection,
  "children"
> & {
  children?: QuiDeclarationReflection[]
  decorators?: string[]
}

export interface ParseResult {
  knownInterfaces: KnownInterfaces
  types: Record<string, QuiPropTypes>
}
