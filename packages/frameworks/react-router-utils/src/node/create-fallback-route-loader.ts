// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type LoaderFunction, redirect} from "react-router"

import type {
  KnowledgePages,
  KnowledgeSections,
  SiteDataExports,
} from "@qualcomm-ui/mdx-common"

interface ExportsLoaderArgs {
  exports: SiteDataExports | undefined
  getPages: () => Promise<KnowledgePages | null>
  getSections: () => Promise<KnowledgeSections | null>
}

export interface FallbackRouteLoaderData {
  /**
   * Pathname of the requested route that could not be resolved
   */
  pathname: string
}

/**
 * Serves knowledge export files. Pages are served dynamically from pages.json.
 */
export function createFallbackRouteLoader({
  exports,
  getPages,
  getSections,
}: ExportsLoaderArgs): LoaderFunction {
  return async ({params, request}) => {
    const path = params["*"]

    if (!path) {
      return redirect("/")
    }

    if (path.endsWith(".md") && exports) {
      try {
        const pages = await getPages()
        if (pages) {
          const adjustedPath = `/${path.replace(/\.md$/, "")}`
          const pageEntry = pages.pages.find(
            (page) => page.pathname === adjustedPath,
          )

          if (pageEntry) {
            return new Response(pageEntry.content || "", {
              headers: {"Content-Type": "text/markdown; charset=utf-8"},
              status: 200,
            })
          } else {
          }
        }
      } catch {
        // fall through to 404
      }
    } else if (path.endsWith(`${exports?.dir ?? ""}sections.json`)) {
      try {
        const sections = await getSections()
        return new Response(JSON.stringify(sections || {}), {
          headers: {"Content-Type": "application/json"},
          status: 200,
        })
      } catch {
        // fall through to 404
      }
    } else if (path.endsWith(`${exports?.dir ?? ""}pages.json`)) {
      try {
        const pages = await getPages()
        return new Response(JSON.stringify(pages || {}), {
          headers: {"Content-Type": "application/json"},
          status: 200,
        })
      } catch {
        // fall through to 404
      }
    }

    return new Response(
      JSON.stringify({
        pathname: new URL(request.url).pathname?.replace(".data", ""),
      } satisfies FallbackRouteLoaderData),
      {headers: {"Content-Type": "application/json"}, status: 404},
    )
  }
}
