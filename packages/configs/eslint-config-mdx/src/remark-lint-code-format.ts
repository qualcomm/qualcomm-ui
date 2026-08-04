// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  formatOxfmt,
  getAbsolutePath,
  getErrorMessage,
  loadOxfmtConfig,
} from "./oxfmt-utils.js"
import type {RemarkNode, RemarkTransformer} from "./remark-types.js"

interface CodeNode extends RemarkNode {
  lang?: string | null
  value: string
}

const LANGUAGE_EXTENSIONS = new Map([
  ["javascript", ".js"],
  ["javascriptreact", ".jsx"],
  ["js", ".js"],
  ["jsx", ".jsx"],
  ["ts", ".ts"],
  ["tsx", ".tsx"],
  ["typescript", ".ts"],
  ["typescriptreact", ".tsx"],
])

export default function remarkLintCodeFormat(): RemarkTransformer {
  return async function transform(tree, file) {
    let oxfmtConfig

    try {
      oxfmtConfig = await loadOxfmtConfig(file.path)
    } catch (error) {
      file.message(
        `Unable to load oxfmt config: ${getErrorMessage(error)}`,
        {column: 1, line: 1},
        "remark-lint:code-format",
      )
      return
    }

    const codeNodes: CodeNode[] = []
    visit<CodeNode>(tree, "code", (node) => {
      if (typeof node.value === "string") {
        codeNodes.push(node)
      }
    })

    for (const [index, node] of codeNodes.entries()) {
      const extension = getExtension(node.lang)

      if (!extension) {
        continue
      }

      const blockFilePath = getBlockFilePath(file.path, index, extension)

      if (isStandaloneJsxSnippet(extension, node.value)) {
        // Fenced TSX examples are not always complete TSX programs. Many docs
        // use them for JSX fragments, where Oxfmt would add ASI semicolons or
        // reflow comments if we wrapped the snippet. Real MDX JSX nodes are
        // handled separately by remark-lint-mdx-jsx-format.
        continue
      }

      const formatted = await formatOxfmt(
        blockFilePath,
        node.value,
        oxfmtConfig,
      )

      if (formatted === null) {
        continue
      }

      if (formatted !== node.value) {
        file.message(
          "Format code block with oxfmt",
          node,
          "remark-lint:code-format",
        )
        node.value = formatted
      }
    }
  }
}

function getBlockFilePath(
  filePath: string | undefined,
  index: number,
  extension: string,
): string {
  return `${getAbsolutePath(filePath)}.${index}${extension}`
}

function getExtension(language: string | null | undefined): null | string {
  if (!language) {
    return null
  }

  const [name = ""] = language.trim().split(/\s+/u)

  return LANGUAGE_EXTENSIONS.get(name.toLowerCase()) ?? null
}

function isStandaloneJsxSnippet(extension: string, value: string): boolean {
  return (
    (extension === ".jsx" || extension === ".tsx") &&
    /^<(?:>|\/?[A-Za-z][\w.:/-]*(?:[\s>/]|$))/u.test(trimLeadingComments(value))
  )
}

function trimLeadingComments(value: string): string {
  let source = value.trimStart()

  while (true) {
    if (source.startsWith("//")) {
      const nextLineIndex = source.indexOf("\n")

      if (nextLineIndex === -1) {
        return ""
      }

      source = source.slice(nextLineIndex + 1).trimStart()
      continue
    }

    if (source.startsWith("/*")) {
      const commentEndIndex = source.indexOf("*/")

      if (commentEndIndex === -1) {
        return source
      }

      source = source.slice(commentEndIndex + 2).trimStart()
      continue
    }

    return source
  }
}

function visit<T extends RemarkNode>(
  node: RemarkNode,
  type: string,
  callback: (node: T) => void,
): void {
  if (node.type === type) {
    callback(node as T)
  }

  if (!Array.isArray(node.children)) {
    return
  }

  for (const child of node.children) {
    visit(child, type, callback)
  }
}
