// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Prefix of the module id of each operation's data, followed by its encoded
 * pathname.
 */
export const OPENAPI_OPERATION_MODULE_PREFIX =
  "@qualcomm-ui/docs-plugin/openapi/operation/"

/**
 * Source of the `@qualcomm-ui/docs-plugin/openapi` virtual module: a route
 * loader returning the operation for the requested page, or a 404. The page is
 * read from the matched `<api>/*` route pattern and its splat rather than the
 * URL, so a React Router `basename` doesn't change it. Requires React Router
 * 7.15, which added `pattern` to the loader arguments.
 *
 * Each operation is its own lazily imported module, so a page only loads its
 * own data: a large spec embedded in a single module can exhaust Vite's memory.
 */
export function getOpenApiModuleCode(
  pathnames: string[],
  getModuleId = (pathname: string) =>
    `${OPENAPI_OPERATION_MODULE_PREFIX}${encodeURIComponent(pathname)}`,
): string {
  const entries = pathnames.map(
    (pathname) =>
      `  ${JSON.stringify(pathname)}: () => import(${JSON.stringify(getModuleId(pathname))}),`,
  )
  return [
    "const operations = {",
    ...entries,
    "}",
    "export async function loader({params, pattern}) {",
    String.raw`  const api = "/" + pattern.replace(/^\/+/, "").replace(/\/\*$/, "")`,
    String.raw`  const pathname = (api + "/" + (params["*"] ?? "")).replace(/\/+$/, "")`,
    "  const load = Object.hasOwn(operations, pathname) && operations[pathname]",
    "  if (!load) {",
    `    return new Response("null", {headers: {"Content-Type": "application/json"}, status: 404})`,
    "  }",
    "  return (await load()).default",
    "}",
  ].join("\n")
}

/**
 * Source of one operation's data module. `JSON.parse` of a string is much
 * cheaper to parse than the same data as an object literal.
 */
export function getOperationModuleCode(operation: unknown): string {
  return `export default JSON.parse(${JSON.stringify(JSON.stringify(operation))})`
}
