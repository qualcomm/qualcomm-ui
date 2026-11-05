// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {upgrade} from "@scalar/openapi-upgrader"
import chalk from "chalk"
import {readFileSync} from "node:fs"
import {dirname, resolve} from "node:path"

import type {OpenApiDocument} from "./get-operations.js"
import {getRemoteSpec, isRemoteSpec} from "./remote-specs.js"

/**
 * Reads the spec referenced by an MDX page and upgrades it to OpenAPI 3.2.
 * Synchronous because the search indexer that calls it is, so remote specs
 * must be downloaded beforehand with `prefetchRemoteSpecs`.
 */
export function loadOpenApiSpec(
  mdxFilePath: string,
  specPath: string,
): OpenApiDocument {
  const source = isRemoteSpec(specPath)
    ? specPath
    : resolve(dirname(mdxFilePath), specPath)
  const raw = isRemoteSpec(specPath)
    ? getRemoteSpec(specPath)
    : JSON.parse(readFileSync(source, "utf-8"))

  const {diagnostics, document} = upgrade(raw, "3.2", {
    onIncompatible: "collect",
  })
  if (!diagnostics.length) {
    return document as OpenApiDocument
  }

  console.warn(
    `${chalk.yellow.bold("OpenAPI spec could not be upgraded losslessly:")} ${source}`,
  )
  for (const diagnostic of diagnostics) {
    console.warn(`- ${diagnostic.message}`)
  }
  // With diagnostics, "collect" falls back to 3.1; "ignore" still yields 3.2.
  return upgrade(raw, "3.2", {onIncompatible: "ignore"}) as OpenApiDocument
}
