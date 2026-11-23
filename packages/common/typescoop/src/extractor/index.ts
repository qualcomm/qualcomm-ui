// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type ts from "typescript"

import type {QuiPropTypes, SerializedRef} from "@qualcomm-ui/typedoc-common"

import {InvalidConfigError} from "../errors.js"
import type {BuildOptions, InlineRefOptions} from "../types.js"

import {collectEntities, type Entity} from "./collect.js"
import {PackageResolver} from "./package-info.js"
import {createExtractorProgram} from "./program.js"
import {serializeRefs} from "./refs.js"
import {Serializer} from "./serializer.js"
import {TypePrinter} from "./type-printer.js"

export interface ParseResult {
  /**
   * Every exported entity, including entities outside the documentation scope.
   */
  knownInterfaces: Record<string, QuiPropTypes>

  /**
   * The declarations of the named types that the entities reference by name,
   * by name.
   */
  refs: Record<string, SerializedRef>

  /**
   * The entities written to the output file.
   */
  types: Record<string, QuiPropTypes>
}

export interface ExtractResult {
  program: ts.Program
  result: ParseResult
}

function isInScope(
  entity: Entity,
  options: BuildOptions,
  packages: PackageResolver,
): boolean {
  if (options.documentationScope === "all") {
    return true
  }
  if (entity.comment.modifiers.has("@public")) {
    return true
  }
  const sourcePackage = packages.resolve(
    entity.declaration.getSourceFile().fileName,
  )
  return (
    !!sourcePackage &&
    !!options.moduleWhitelist?.includes(sourcePackage.packageName)
  )
}

/**
 * Object entities are documented through their props. Their printed structure is
 * only needed for inspection, so it is computed on first access.
 */
function withLazyResolvedType(
  serialized: QuiPropTypes,
  print: () => string,
): QuiPropTypes {
  let resolvedType: QuiPropTypes["resolvedType"]
  return Object.defineProperty({...serialized}, "resolvedType", {
    enumerable: false,
    get() {
      if (!resolvedType) {
        const type = print()
        resolvedType = {name: serialized.name, prettyType: type, type}
      }
      return resolvedType
    },
  })
}

/**
 * Builds the documentation model from the TypeScript program described by the
 * options. Pass the previous program to reuse its unchanged source files.
 */
export async function extract(
  options: BuildOptions,
  oldProgram?: ts.Program,
): Promise<ExtractResult> {
  const extractorProgram = await createExtractorProgram(
    {
      entryPoints: options.entryPoints,
      tsconfig: options.tsconfig,
    },
    oldProgram,
  )
  const {checker, program} = extractorProgram

  const packages = new PackageResolver()
  await packages.load(program.getSourceFiles().map((file) => file.fileName))

  const entities = collectEntities(extractorProgram)
  const documented = new Set(entities.map((entity) => entity.symbol))
  const documentedNames = new Set(entities.map((entity) => entity.name))
  const printer = new TypePrinter({
    checker,
    inlineRefs: validateInlineRefs(options.inlineRefs),
    // the checker caches unions by their members, so a union can carry the
    // alias of a duplicate declaration, such as the built `.d.ts` of a
    // documented package. Names match those duplicates.
    isDocumented: (symbol) =>
      documented.has(symbol) || documentedNames.has(symbol.name),
  })
  const serializer = new Serializer({
    checker,
    entities,
    importResolver: options.importResolver,
    packages,
    printer,
    referenceLinks: options.referenceLinks,
  })

  const knownInterfaces: Record<string, QuiPropTypes> = {}
  const types: Record<string, QuiPropTypes> = {}
  for (const entity of entities) {
    const serialized = await serializer.serializeEntity(entity)
    knownInterfaces[entity.name] = serialized.resolvedType
      ? serialized
      : withLazyResolvedType(serialized, () =>
          serializer.printEntityType(entity),
        )
    if (isInScope(entity, options, packages)) {
      types[entity.name] = serialized
    }
  }

  const refs = await serializeRefs(printer, program)

  return {program, result: {knownInterfaces, refs, types}}
}

function validateInlineRefs(
  inlineRefs: InlineRefOptions | undefined,
): InlineRefOptions | undefined {
  for (const [key, value] of Object.entries(inlineRefs ?? {})) {
    if (value !== undefined && !(Number.isInteger(value) && value >= 0)) {
      throw new InvalidConfigError(
        `Invalid config: inlineRefs.${key} must be a non-negative integer.`,
      )
    }
  }
  return inlineRefs
}
