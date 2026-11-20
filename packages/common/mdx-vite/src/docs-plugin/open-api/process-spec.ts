// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Root} from "hast"
import {toText} from "hast-util-to-text"
import {statSync} from "node:fs"

import {
  type OpenApiOperationDetails,
  resolveOperation,
} from "./get-operation-details.js"
import {getOperations, type TagObject} from "./get-operations.js"
import {loadOpenApiSpec} from "./load-spec.js"
import {parseDescriptions} from "./parse-descriptions.js"
import {getRemoteSpec, isRemoteSpec} from "./remote-specs.js"

export interface ProcessedOperation {
  /**
   * The operation's page data.
   */
  details: OpenApiOperationDetails
  /**
   * The operation's description before it was parsed.
   */
  markdown: string
  /**
   * The operation's description as plain text.
   */
  searchText: string
}

export interface ProcessedSpec {
  operations: ProcessedOperation[]
  tags: TagObject[] | undefined
}

const cache = new Map<string, {result: ProcessedSpec; version: unknown}>()

/**
 * A local spec's modification time and size, or the prefetched download of a
 * remote one. `undefined` when the file can't be read, so loading reports why.
 */
function getVersion(source: string): unknown {
  if (isRemoteSpec(source)) {
    return getRemoteSpec(source)
  }
  try {
    const {mtimeMs, size} = statSync(source)
    return `${mtimeMs}:${size}`
  } catch {
    return undefined
  }
}

/**
 * Loads a spec and prepares the page data of its operations. The dev server
 * reindexes on every MDX save, and large specs take seconds to process, so
 * results are reused until the spec changes.
 *
 * @param source as returned by `getSpecSource`.
 */
export function processOpenApiSpec(source: string): ProcessedSpec {
  const version = getVersion(source)
  const cached = cache.get(source)
  if (version !== undefined && cached?.version === version) {
    return cached.result
  }

  const spec = loadOpenApiSpec(source)
  const result: ProcessedSpec = {
    operations: getOperations(spec).map((operation) => {
      const resolved = resolveOperation(spec, operation)
      const details = parseDescriptions(resolved)
      const description = details.description as Root | undefined
      return {
        details,
        markdown:
          typeof resolved.description === "string" ? resolved.description : "",
        searchText: description ? toText(description).trim() : "",
      }
    }),
    tags: spec.tags,
  }
  if (version !== undefined) {
    cache.set(source, {result, version})
  }
  return result
}
