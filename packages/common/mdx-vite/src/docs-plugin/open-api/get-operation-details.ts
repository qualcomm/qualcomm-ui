// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {dereference} from "./dereference.js"
import type {OpenApiDocument, OpenApiOperation} from "./get-operations.js"

interface ParameterObject {
  in: string
  name: string
}

/**
 * The full operation for its page: spec fields with refs inlined, path-level
 * parameters merged in, and the spec's servers attached.
 */
export interface OpenApiOperationDetails extends OpenApiOperation {
  [key: string]: unknown
  parameters: ParameterObject[]
  servers: unknown[]
}

export function getOperationDetails(
  document: OpenApiDocument,
  operation: OpenApiOperation,
): OpenApiOperationDetails {
  const pathItem = dereference(
    document.paths?.[operation.path] ?? {},
    document,
  ) as Record<string, unknown> & {parameters?: ParameterObject[]}
  const spec = (pathItem[operation.method] ?? {}) as Record<string, unknown> & {
    parameters?: ParameterObject[]
  }

  // Operation parameters override path parameters with the same name and location.
  const own = spec.parameters ?? []
  const inherited = (pathItem.parameters ?? []).filter(
    (parameter) =>
      !own.some((p) => p.name === parameter.name && p.in === parameter.in),
  )

  return {
    ...spec,
    ...operation,
    parameters: [...inherited, ...own],
    servers: (spec.servers ??
      pathItem.servers ??
      (document as {servers?: unknown[]}).servers ??
      []) as unknown[],
  }
}
