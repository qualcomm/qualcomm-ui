// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {readFile} from "node:fs/promises"

import {parseFrontmatterYaml} from "../markdown/markdown-file-reader.js"

const remoteSpecs = new Map<string, unknown>()
const fetchErrors = new Map<string, {error: Error; failedAt: number}>()

/**
 * An unreachable host can take the full fetch timeout to fail, and the dev
 * server prefetches on every MDX save.
 */
const retryDelay = 60_000

export function isRemoteSpec(specPath: string): boolean {
  return /^https?:\/\//i.test(specPath)
}

export function getRemoteSpec(url: string): unknown {
  const fetchError = fetchErrors.get(url)
  if (fetchError) {
    throw fetchError.error
  }
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
        const failedAt = specPath && fetchErrors.get(specPath)?.failedAt
        if (
          specPath &&
          isRemoteSpec(specPath) &&
          !remoteSpecs.has(specPath) &&
          !(failedAt && Date.now() - failedAt < retryDelay)
        ) {
          urls.add(specPath)
        }
      }),
  )
  await Promise.all([...urls].map(fetchSpec))
}

/**
 * Failures are kept for the indexer to report, so they surface for the page
 * that references the spec. Failed specs are retried after `retryDelay`.
 */
async function fetchSpec(url: string): Promise<void> {
  try {
    const response = await fetch(url, {signal: AbortSignal.timeout(30_000)})
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }
    remoteSpecs.set(url, await response.json())
    fetchErrors.delete(url)
  } catch (error) {
    const cause = (error as Error).cause as Error | undefined
    fetchErrors.set(url, {
      error: new Error(
        `Failed to fetch ${url}: ${(error as Error).message}${cause?.message ? ` (${cause.message})` : ""}`,
      ),
      failedAt: Date.now(),
    })
  }
}
