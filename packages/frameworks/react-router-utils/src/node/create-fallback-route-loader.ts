// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type LoaderFunction,
  type MiddlewareFunction,
  redirect,
} from "react-router"

import type {
  KnowledgePages,
  KnowledgeSections,
  SiteDataExports,
} from "@qualcomm-ui/mdx-common"

export interface FallbackRouteArgs {
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

async function getExportResponse(
  path: string,
  {exports, getPages, getSections}: FallbackRouteArgs,
): Promise<Response | null> {
  if (path.endsWith(".md") && exports) {
    try {
      const pages = await getPages()
      const adjustedPath = `/${path.replace(/\.md$/, "")}`
      const pageEntry = pages?.pages.find(
        (page) => page.pathname === adjustedPath,
      )
      if (pageEntry) {
        return new Response(pageEntry.content || "", {
          headers: {"Content-Type": "text/markdown; charset=utf-8"},
          status: 200,
        })
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
  return null
}

/**
 * Serves knowledge export files from a fallback route that renders a component.
 * React Router treats a route with a default export as a document route, so a
 * Response returned from its loader is unwrapped into loader data and rendered
 * as HTML. Middleware can short-circuit with a raw Response before rendering.
 */
export function createFallbackRouteMiddleware(
  args: FallbackRouteArgs,
): MiddlewareFunction<Response> {
  return async ({params}, next) => {
    const path = params["*"]
    if (path) {
      const response = await getExportResponse(path, args)
      if (response) {
        return response
      }
    }
    return next()
  }
}

/**
 * Serves knowledge export files. Pages are served dynamically from pages.json.
 * Export files are only served when the route has no default export (resource
 * route). Use {@link createFallbackRouteMiddleware} alongside this loader when
 * the route renders a not found component.
 */
export function createFallbackRouteLoader(
  args: FallbackRouteArgs,
): LoaderFunction {
  return async ({params, request}) => {
    const path = params["*"]

    if (!path) {
      return redirect("/")
    }

    const response = await getExportResponse(path, args)
    if (response) {
      return response
    }

    return new Response(
      JSON.stringify({
        pathname: new URL(request.url).pathname?.replace(".data", ""),
      } satisfies FallbackRouteLoaderData),
      {headers: {"Content-Type": "application/json"}, status: 404},
    )
  }
}
