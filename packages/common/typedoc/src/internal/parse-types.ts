// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type JSONOutput, ReflectionKind} from "typedoc"

import type {QuiPropTypes} from "@qualcomm-ui/typedoc-common"

import type {BuildOptions} from "../types"

import {TypeDocPropBuilder} from "./prop-builder"
import {TypeSerializer} from "./type-serializer"
import type {
  KnownInterfaces,
  ParseResult,
  QuiDeclarationReflection,
  QuiReflectionSymbolId,
} from "./types"

/**
 * Iterate through every node.
 * For each type, assign the full type details to the type's symbol id for lookup.
 * This parses top-level exports like our component props and globally exported
 * functions / types.
 */
async function getTypeDetails(
  node: QuiDeclarationReflection,
  symbolMap: Record<number, JSONOutput.ReflectionSymbolId>,
  knownInterfaces: KnownInterfaces = {},
) {
  const serializer = new TypeSerializer({knownInterfaces, symbolMap})
  const symbolNameMapWithDetails: Record<string, QuiReflectionSymbolId> = {}
  const children = node.children ?? []
  if (
    node.kind !== ReflectionKind.Project &&
    node.kind !== ReflectionKind.Module
  ) {
    const {sources, ...rest} = node
    const serializedType = await serializer.serializeTypes(rest)
    symbolNameMapWithDetails[symbolMap[node.id]?.qualifiedName] = {
      ...symbolMap[node.id],
      details: {...rest, url: sources?.[0]?.url},
      resolvedType: serializedType,
    }
  } else {
    await Promise.all(
      children.map(async ({sources, ...child}) => {
        const {id} = child
        const serializedType = await serializer.serializeTypes(child, node)

        symbolNameMapWithDetails[symbolMap[id]?.qualifiedName] = {
          ...symbolMap[id],
          details: {...child, url: sources?.[0]?.url},
          resolvedType: serializedType,
        }
      }),
    )
  }
  return symbolNameMapWithDetails
}

async function parseNodes(
  nodes: JSONOutput.DeclarationReflection[],
  symbolIdMap: Record<number, JSONOutput.ReflectionSymbolId>,
  knownInterfaces: Record<string | number, QuiReflectionSymbolId> = {},
) {
  const parsedNodes = await Promise.all(
    nodes.map((node) => getTypeDetails(node, symbolIdMap, knownInterfaces)),
  )

  return parsedNodes.reduce(
    (acc: Record<string | number, QuiReflectionSymbolId>, node) => {
      acc = {...acc, ...node}
      return acc
    },
    knownInterfaces,
  )
}

function getTypeNodes(
  node: JSONOutput.DeclarationReflection,
): JSONOutput.DeclarationReflection[] {
  if (
    node.kind === ReflectionKind.Project ||
    node.kind === ReflectionKind.Module
  ) {
    return getMultiTypeNodes(node.children ?? [])
  }
  return [node]
}

function getMultiTypeNodes(
  nodes: JSONOutput.DeclarationReflection[],
): JSONOutput.DeclarationReflection[] {
  return nodes.map(getTypeNodes).flat()
}

export async function parseTypes(
  json: JSONOutput.ProjectReflection,
  options: BuildOptions,
): Promise<ParseResult> {
  const children = json.children ?? []

  // TODO: refactor using recursive instead of multi-pass.  Deeply nested properties
  // are not being parsed on the first pass. Need a better resolution. Might
  // refactor using C++ or Rust for more performance.
  // first pass: build the known interfaces from the type definitions
  const knownInterfacesFirstPass = await parseNodes(children, json.symbolIdMap)

  /**
   * second pass: build the known interfaces a second time using the
   * result of the first pass to resolve types. This second pass is necessary
   * because the parser analyzes each folder in alphabetical order.
   *
   * If module A has a dependency on module B, it won't know what module B is
   * because B hasn't been parsed yet.
   *
   * TODO: refactor to a dependency graph.
   */
  const knownInterfacesSecondPass = await parseNodes(
    children,
    json.symbolIdMap,
    knownInterfacesFirstPass,
  )

  /**
   * TODO: refactor to a dependency graph.
   */
  const knownInterfaces = await parseNodes(
    children,
    json.symbolIdMap,
    knownInterfacesSecondPass,
  )

  const utils = new TypeDocPropBuilder({
    importResolver: options.importResolver,
    knownInterfaces,
    referenceLinks: options.referenceLinks,
    symbolMap: json.symbolIdMap,
  })

  const publicModules = new Set<string>(options.moduleWhitelist ?? [])

  const publicNodes =
    options.documentationScope === "only-public"
      ? getMultiTypeNodes(children).filter((node) => {
          const isPublic = node.flags.isPublic
          const symbolId = json.symbolIdMap[node.id]
          return (
            isPublic || (symbolId && publicModules.has(symbolId.packageName))
          )
        })
      : getMultiTypeNodes(children)
  // third pass: build the React props, using the known interfaces to resolve
  // references.
  const propTypes: QuiPropTypes[] = await Promise.all(
    publicNodes.map(async (node) => {
      return utils.build(node)
    }),
  )

  return {
    knownInterfaces,
    types: propTypes.reduce((acc: Record<string, QuiPropTypes>, current) => {
      acc[current.name] = current
      return acc
    }, {}),
  }
}
