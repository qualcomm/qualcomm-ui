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
  async function visit(entries: T[], parentPath: string): Promise<T[]> {
    const result: T[] = []
    for (const route of entries) {
      const fullPath = [parentPath, route.path].filter(Boolean).join("/")
      const children = route.children
        ? await visit(route.children as T[], fullPath)
        : undefined
      result.push(children ? {...route, children} : route)

      if (!route.file.endsWith(".mdx")) {
        continue
      }
      const contents = await readFile(
        resolve(appDirectory, route.file),
        "utf-8",
      )
      if (!parseFrontmatterYaml(contents)?.openApi) {
        continue
      }
      // Its operation route would be `/*`, the site's own catch-all.
      if (!fullPath.replaceAll("/", "")) {
        throw new Error(
          `${route.file}: the site's root page can't be an OpenAPI page. Move it to a subpath.`,
        )
      }
      result.push({
        file: operationPage,
        id: `${route.id ?? route.file}/openapi`,
        path: route.path ? `${route.path}/*` : "*",
      } as T)
    }
    return result
  }

  return visit(routes, "")
}
