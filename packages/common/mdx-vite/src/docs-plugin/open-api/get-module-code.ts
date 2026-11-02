// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Source of the `@qualcomm-ui/docs-plugin/openapi` virtual module: a route
 * loader returning the operation for the requested page. The page is
 * read from the matched `<api>/*` route pattern and its splat rather than the
 * URL, so a React Router `basename` doesn't change it. Requires React Router
 * 7.15, which added `pattern` to the loader arguments.
 */
export function getOpenApiModuleCode(
  operations: Record<string, unknown>,
): string {
  return [
    `const operations = ${JSON.stringify(operations)}`,
    "export function loader({params, pattern}) {",
    String.raw`  const api = "/" + pattern.replace(/^\/+/, "").replace(/\/\*$/, "")`,
    String.raw`  const pathname = (api + "/" + (params["*"] ?? "")).replace(/\/+$/, "")`,
    "  return operations[pathname] ?? null",
    "}",
  ].join("\n")
}
