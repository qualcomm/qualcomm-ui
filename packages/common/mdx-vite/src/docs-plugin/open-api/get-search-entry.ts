// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Root} from "hast"
import {toText} from "hast-util-to-text"

import type {GeneratedPage} from "../markdown/knowledge/knowledge-exporter.js"

import type {OpenApiOperationDetails} from "./get-operation-details.js"
import {getOperationTitle} from "./get-operations.js"

/**
 * The searchable content of one operation page: its description, and as terms
 * the endpoint (`GET /pets/{petId}`), the operationId, and the parameter names.
 *
 * @param operation as returned by `getOperationDetails`.
 * @param markdown the operation's description before it was parsed.
 */
export function getSearchEntry(
  pathname: string,
  operation: OpenApiOperationDetails,
  markdown: string,
): GeneratedPage {
  const description = operation.description as Root | undefined
  const terms = new Set([
    `${operation.method.toUpperCase()} ${operation.path}`,
    ...(typeof operation.operationId === "string"
      ? [operation.operationId]
      : []),
    // Parameters behind an unresolved `$ref` (another file) have no name.
    ...operation.parameters.flatMap((parameter) =>
      typeof parameter.name === "string" ? [parameter.name] : [],
    ),
  ])
  return {
    content: markdown,
    pathname,
    searchText: description ? toText(description).trim() : "",
    slug: operation.slug,
    terms: [...terms],
    title: getOperationTitle(operation),
  }
}
