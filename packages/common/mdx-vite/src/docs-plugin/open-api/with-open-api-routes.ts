// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {readFile} from "node:fs/promises"
import {resolve} from "node:path"

import {parseFrontmatterYaml} from "../markdown/markdown-file-reader.js"

/**
 * Structural subset of React Router's `RouteConfigEntry`.
 */
export interface OpenApiRouteEntry {
  caseSensitive?: boolean
  children?: OpenApiRouteEntry[]
  file: string
  id?: string
  index?: boolean
  path?: string
}

export interface WithOpenApiRoutesOptions {
  /**
   * The React Router app directory that route files are relative to.
   */
  appDirectory: string

  /**
   * Absolute path to the component that renders operation pages.
   */
  operationPage: string
}

/**
 * Adds a `<path>/*` route next to every MDX route whose frontmatter declares
 * `openApi`. The added route renders the generated operation pages.
 *
 * @since next-release
 */
export async function withOpenApiRoutes<T extends OpenApiRouteEntry>(
  routes: T[],
  {appDirectory, operationPage}: WithOpenApiRoutesOptions,
): Promise<T[]> {
  async function isApiPage(route: T): Promise<boolean> {
    if (!route.file.endsWith(".mdx")) {
      return false
    }
    const contents = await readFile(resolve(appDirectory, route.file), "utf-8")
    return (
      contents.includes("openApi:") && !!parseFrontmatterYaml(contents)?.openApi
    )
  }

  async function visit(entries: T[], parentPath: string): Promise<T[]> {
    const visited = await Promise.all(
      entries.map(async (route): Promise<T[]> => {
        const fullPath = [parentPath, route.path].filter(Boolean).join("/")
        const [children, apiPage] = await Promise.all([
          route.children && visit(route.children as T[], fullPath),
          isApiPage(route),
        ])
        const entry = children ? {...route, children} : route
        if (!apiPage) {
          return [entry]
        }
        // Its operation route would be `/*`, the site's own catch-all.
        if (!fullPath.replaceAll("/", "")) {
          throw new Error(
            `${route.file}: the site's root page can't be an OpenAPI page. Move it to a subpath.`,
          )
        }
        return [
          entry,
          {
            file: operationPage,
            id: `${route.id ?? route.file}/openapi`,
            path: route.path ? `${route.path}/*` : "*",
          } as T,
        ]
      }),
    )
    return visited.flat()
  }

  return visit(routes, "")
}
