// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {MdxJsxAttribute, MdxJsxFlowElement} from "mdast-util-mdx-jsx"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

function themeDataToJson(data: unknown, cssPropertyName?: string): string {
  if (!data || typeof data !== "object") {
    return ""
  }

  if (cssPropertyName) {
    return JSON.stringify({cssProperty: cssPropertyName, data}, null, 2)
  }

  return JSON.stringify(data, null, 2)
}

function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      obj,
    )
}

function getAttrExpression(
  node: MdxJsxFlowElement,
  name: string,
): string | null {
  const attr = node.attributes?.find(
    (a): a is MdxJsxAttribute =>
      a.type === "mdxJsxAttribute" && a.name === name,
  )
  if (!attr?.value) {
    return null
  }
  if (typeof attr.value === "string") {
    return attr.value
  } else if (typeof attr.value === "object" && "value" in attr.value) {
    return attr.value.value
  }
  return null
}

/**
 * Creates a remark plugin that replaces theme JSX elements with
 * markdown tables containing theme data from.
 */
export async function formatThemeNodes(): Promise<Plugin> {
  let themes: any | null = null
  try {
    // may not be available since this is an optional dependency
    themes = await import("@qualcomm-ui/tailwind-plugin/theme")
  } catch {
    return () => {}
  }

  const handlers: Record<string, (node: MdxJsxFlowElement) => unknown> = {
    ColorTable: (node) => {
      const path = getAttrExpression(node, "data")
      return path && getPath(themes, path)
    },
    FontTable: (node) => {
      const path = getAttrExpression(node, "data")
      return path && getPath(themes, path)
    },
    SpacingTable: (node) => {
      const path = getAttrExpression(node, "data")
      return path && getPath(themes, path)
    },
    ThemePropertyTable: (node) => {
      const path = getAttrExpression(node, "data")
      const property = getAttrExpression(node, "cssProperty")
      const data = path && getPath(themes, path)
      return path && property ? {cssPropertyName: property, data} : undefined
    },
  }

  return () => (tree, _file, done) => {
    visit(tree, "mdxJsxFlowElement", (node: MdxJsxFlowElement) => {
      const handler = node.name && handlers[node.name]
      if (!handler) {
        return
      }

      const data = handler(node)
      if (!data) {
        console.warn(`No theme data for ${node.name}`)
        return
      }

      let markdownTable: string
      if (
        typeof data === "object" &&
        data !== null &&
        "cssPropertyName" in data &&
        "data" in data
      ) {
        const {cssPropertyName, data: themeData} = data as {
          cssPropertyName: string
          data: unknown
        }
        markdownTable = themeDataToJson(themeData, cssPropertyName)
      } else {
        markdownTable = themeDataToJson(data)
      }

      if (!markdownTable) {
        return
      }

      Object.assign(node, {
        lang: "json",
        meta: null,
        type: "code",
        value: markdownTable,
      })
    })
    done()
  }
}
