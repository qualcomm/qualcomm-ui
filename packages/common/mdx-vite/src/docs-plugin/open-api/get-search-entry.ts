// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {GeneratedPage} from "../markdown/knowledge/knowledge-exporter.js"

import {getOperationTitle} from "./get-operations.js"
import type {ProcessedOperation} from "./process-spec.js"

/**
 * The searchable content of one operation page: its description, and as terms
 * the endpoint (`GET /pets/{petId}`), the operationId, and the parameter names.
 */
export function getSearchEntry(
  pathname: string,
  {details, markdown, searchText}: ProcessedOperation,
): GeneratedPage {
  const terms = new Set([
    `${details.method.toUpperCase()} ${details.path}`,
    ...(typeof details.operationId === "string" ? [details.operationId] : []),
    // Parameters behind an unresolved `$ref` (another file) have no name.
    ...details.parameters.flatMap((parameter) =>
      typeof parameter.name === "string" ? [parameter.name] : [],
    ),
  ])
  return {
    content: markdown,
    pathname,
    searchText,
    slug: details.slug,
    terms: [...terms],
    title: getOperationTitle(details),
  }
}
