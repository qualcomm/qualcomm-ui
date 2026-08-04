// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FormatConfig} from "oxfmt"

import {
  formatOxfmt,
  getAbsolutePath,
  getErrorMessage,
  loadOxfmtConfig,
} from "./oxfmt-utils.js"
import type {RemarkFile, RemarkNode, RemarkTransformer} from "./remark-types.js"

export default function remarkLintMdxJsxFormat(): RemarkTransformer {
  return async function transform(tree, file) {
    const source = getFileValue(file)

    if (!source) {
      return
    }

    let oxfmtConfig

    try {
      oxfmtConfig = await loadOxfmtConfig(file.path)
    } catch (error) {
      file.message(
        `Unable to load oxfmt config: ${getErrorMessage(error)}`,
        {column: 1, line: 1},
        "remark-lint:mdx-jsx-format",
      )
      await replaceMdxJsxFlowElements(tree, source, file.path, null, file)
      return
    }

    await replaceMdxJsxFlowElements(tree, source, file.path, oxfmtConfig, file)
  }
}

async function replaceMdxJsxFlowElements(
  node: RemarkNode,
  source: string,
  filePath: string | undefined,
  config: FormatConfig | null,
  file: RemarkFile,
): Promise<void> {
  if (!Array.isArray(node.children)) {
    return
  }

  const children: RemarkNode[] = []

  for (const child of node.children) {
    if (child.type === "mdxJsxFlowElement") {
      const raw = getSourceSlice(source, child)

      if (raw === null) {
        children.push(child)
        continue
      }

      const formatted =
        config === null || hasChildren(child)
          ? raw
          : await formatMdxJsxBlock(filePath, raw, config)

      if (formatted !== raw) {
        file.message(
          "Format MDX JSX block",
          child,
          "remark-lint:mdx-jsx-format",
        )
      }

      children.push({
        type: "html",
        value: formatted,
      })
      continue
    }

    await replaceMdxJsxFlowElements(child, source, filePath, config, file)
    children.push(child)
  }

  node.children = children
}

async function formatMdxJsxBlock(
  filePath: string | undefined,
  value: string,
  config: FormatConfig,
): Promise<string> {
  const formatted = await formatOxfmt(
    getBlockFilePath(filePath),
    wrapMdxJsxBlock(value),
    config,
  )

  if (formatted === null) {
    return value
  }

  return unwrapMdxJsxBlock(formatted) ?? value
}

function wrapMdxJsxBlock(value: string): string {
  return `const __mdx = (
  <>
${value}
  </>
)
`
}

function unwrapMdxJsxBlock(value: string): null | string {
  const lines = value.split(/\r?\n/u)
  const openIndex = lines.findIndex((line) => line.trim() === "<>")
  const closeIndex = lines.findIndex(
    (line, index) => index > openIndex && line.trim() === "</>",
  )

  if (openIndex === -1 || closeIndex === -1 || closeIndex <= openIndex + 1) {
    return null
  }

  return lines
    .slice(openIndex + 1, closeIndex)
    .map((line) => (line.startsWith("    ") ? line.slice(4) : line))
    .join("\n")
}

function getSourceSlice(source: string, node: RemarkNode): null | string {
  const start = node.position?.start?.offset
  const end = node.position?.end?.offset

  if (typeof start !== "number" || typeof end !== "number") {
    return null
  }

  return source.slice(start, end)
}

function getFileValue(file: RemarkFile): string {
  return (file.value ?? "") as string
}

function getBlockFilePath(filePath: string | undefined): string {
  return `${getAbsolutePath(filePath)}.jsx.tsx`
}

function hasChildren(node: RemarkNode): boolean {
  return Array.isArray(node.children) && node.children.length > 0
}
