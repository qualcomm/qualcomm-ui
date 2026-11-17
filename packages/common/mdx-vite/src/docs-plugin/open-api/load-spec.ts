// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {upgrade} from "@scalar/openapi-upgrader"
import chalk from "chalk"
import {readFileSync} from "node:fs"
import {dirname, resolve} from "node:path"

import {fixPath} from "../path-utils.js"

import type {OpenApiDocument} from "./get-operations.js"
import {getRemoteSpec, isRemoteSpec} from "./remote-specs.js"

/**
 * The spec's URL, or its absolute path when it's a local file.
 */
export function getSpecSource(mdxFilePath: string, specPath: string): string {
  return isRemoteSpec(specPath)
    ? specPath
    : fixPath(resolve(dirname(mdxFilePath), specPath))
}

function readLocalSpec(source: string): unknown {
  let contents: string
  try {
    contents = readFileSync(source, "utf-8")
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`File not found: ${source}`)
    }
    throw error
  }
  try {
    return JSON.parse(contents)
  } catch (error) {
    throw new Error(`${source} is not valid JSON: ${(error as Error).message}`)
  }
}

/**
 * Reads a spec and upgrades it to OpenAPI 3.2. Synchronous because the search
 * indexer that calls it is, so remote specs must be downloaded beforehand with
 * `prefetchRemoteSpecs`.
 *
 * @param source as returned by {@link getSpecSource}.
 */
export function loadOpenApiSpec(source: string): OpenApiDocument {
  const raw = isRemoteSpec(source)
    ? getRemoteSpec(source)
    : readLocalSpec(source)
  if (
    !raw ||
    typeof raw !== "object" ||
    !("openapi" in raw || "swagger" in raw)
  ) {
    throw new Error(
      `${source} is not an OpenAPI document: it has no "openapi" or "swagger" field.`,
    )
  }

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
