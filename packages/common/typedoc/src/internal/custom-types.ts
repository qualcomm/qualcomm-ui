// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {JSONOutput} from "typedoc"

export const TypeKind = {
  1: "Project",
  2: "Module",
  4: "Namespace",
  8: "Enum",
  16: "EnumMember",
  32: "Variable",
  64: "Function",
  128: "Class",
  256: "Interface",
  512: "Constructor",
  1024: "Property",
  2048: "Method",
  4096: "CallSignature",
  8192: "IndexSignature",
  16384: "ConstructorSignature",
  32768: "Parameter",
  65536: "TypeLiteral",
  131072: "TypeParameter",
  262144: "Accessor",
  524288: "GetSignature",
  1048576: "SetSignature",
  2097152: "TypeAlias",
  4194304: "Reference",
}

export const ignoredTypes: RegExp =
  /(React).*|(PolymorphicRef)|(Partial)|(ReactElement)|(TransitionProps)/

export const customTypes: Record<string, JSONOutput.SomeType> = {
  AnimationEvent_2: {
    name: "AnimationEvent",
    package: "@angular/animations",
    target: {
      packageName: "@angular/animations",
      packagePath: "",
      qualifiedName: "AnimationEvent_2",
    },
    type: "reference",
  },
  as: {
    type: "union",
    types: [
      {
        name: "ElementType",
        type: "intrinsic",
      },
      {
        name: "ComponentType",
        type: "intrinsic",
      },
    ],
  } satisfies JSONOutput.UnionType,
}

export function transformSources(
  sources: JSONOutput.SourceReference[] | undefined,
): string[] | undefined {
  const transformed = sources
    ?.map((source) => source.url ?? "")
    ?.filter(Boolean)
  return transformed?.length ? transformed : undefined
}
