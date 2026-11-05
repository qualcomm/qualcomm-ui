// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {readFile} from "node:fs/promises"

import {parseFrontmatterYaml} from "../markdown/markdown-file-reader.js"

const remoteSpecs = new Map<string, unknown>()

export function isRemoteSpec(specPath: string): boolean {
  return /^https?:\/\//i.test(specPath)
}

export function getRemoteSpec(url: string): unknown {
  if (!remoteSpecs.has(url)) {
    throw new Error(`OpenAPI spec was not prefetched: ${url}`)
  }
  return remoteSpecs.get(url)
}

/**
 * Downloads the remote specs referenced by the given MDX files so that the
 * synchronous indexer can read them. The cache lives as long as the process,
 * so the dev server doesn't refetch a spec on every change.
 */
export async function prefetchRemoteSpecs(files: string[]): Promise<void> {
  const urls = new Set<string>()
  await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        // An MDX file can briefly vanish while an editor saves it atomically.
        // Skip it for this pass instead of failing the whole prefetch.
        const contents = await readFile(file, "utf-8").catch(() => "")
        if (!contents.includes("openApi:")) {
          return
        }
        const specPath = parseFrontmatterYaml(contents)?.openApi
        if (specPath && isRemoteSpec(specPath) && !remoteSpecs.has(specPath)) {
          urls.add(specPath)
        }
      }),
  )
  await Promise.all(
    [...urls].map(async (url) => {
      const response = await fetch(url, {signal: AbortSignal.timeout(30_000)})
      if (!response.ok) {
        throw new Error(
          `Failed to fetch OpenAPI spec ${url}: ${response.status} ${response.statusText}`,
        )
      }
      remoteSpecs.set(url, await response.json())
    }),
  )
}
