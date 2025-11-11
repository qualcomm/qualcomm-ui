// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {JSONOutput} from "typedoc"

import {isInputSignal, isReferenceType} from "../guards"
import type {ImportResolverFn} from "../types"

export class ImportBuilder {
  readonly symbolMap: Record<number, JSONOutput.ReflectionSymbolId>
  readonly importResolver: ImportResolverFn | undefined

  constructor(
    symbolMap: Record<number, JSONOutput.ReflectionSymbolId>,
    importResolver: ImportResolverFn | undefined,
  ) {
    this.symbolMap = symbolMap
    this.importResolver = importResolver
  }

  /**
   * Resolves and pretty-formats the full import string from the name and id.
   * Requires the `importResolver` config option to be supplied, and only applies to
   * reference types.
   */
  async resolveImport(
    type: JSONOutput.ReferenceType,
  ): Promise<string | undefined> {
    // TODO: find a better way.
    // for some generic types, i.e. WithDataAttributes, we just want the inner type.
    // Leave up to the consumer to decide?
    if (isInputSignal(type.name)) {
      const target = type.typeArguments![0]
      if (isReferenceType(target)) {
        return this.resolveImport(target)
      }
    }
    const symbol = typeof type === "number" ? this.symbolMap[type] : type
    if (type.refersToTypeParameter) {
      return undefined
    }
    if (!this.importResolver || !symbol) {
      return undefined
    }
    if (symbol && "packagePath" in symbol) {
      return this.resolveType(type, symbol)
    } else if (type.target) {
      const target =
        typeof type.target === "number"
          ? this.symbolMap[type.target]
          : type.target
      if (target && "packagePath" in target) {
        return this.resolveType(type, target)
      }
    }
    return undefined
  }

  private async resolveType(
    type: JSONOutput.ReferenceType,
    symbol: JSONOutput.ReflectionSymbolId,
  ): Promise<string | undefined> {
    if (!this.importResolver) {
      return undefined
    }
    const qualifiedName = symbol.qualifiedName
    if (qualifiedName.includes(".")) {
      const [namespace, name] = qualifiedName.split(".")
      if (type.refersToTypeParameter) {
        return this.importResolver({
          ...symbol,
          builder: this,
          name: namespace,
          type,
        })
      }
      return this.importResolver({
        ...symbol,
        builder: this,
        name,
        namespace,
        type,
      })
    }
    return this.importResolver({
      ...symbol,
      builder: this,
      name: qualifiedName,
      type,
    })
  }
}
