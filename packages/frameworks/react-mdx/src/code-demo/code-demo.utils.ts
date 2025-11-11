// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {SourceCodeData} from "@qualcomm-ui/mdx-common"
import {dedent} from "@qualcomm-ui/utils/dedent"

export interface PreviewBlock {
  content: string
  endLine: number
  startLine: number
}

export interface ExtractedPreview {
  formattedPreview?: string
  previewBlocks?: PreviewBlock[]
  sourceWithoutPreviews: string
}

/**
 * Extracts preview blocks from source code and returns both the blocks and the
 * original source with preview marker lines removed.
 *
 * This function identifies `// preview` comment pairs, extracts the content between
 * them as preview blocks, and returns a cleaned version of the source code with
 * all preview marker lines removed but preview content preserved.
 *
 * @param code - The source code string to process
 * @returns Object containing the extracted preview blocks and cleaned source code
 *
 * @example
 * ```typescript
 * const sourceCode = `
 * function Component() {
 *   return (
 *     // preview
 *     <div>Hello World</div>
 *     // preview
 *   )
 * }`
 *
 * const {previewBlocks, sourceWithoutPreviews} = extractPreviewsAndCleanSource(sourceCode)
 *
 * console.log(previewBlocks[0].content) // "<div>Hello World</div>"
 * console.log(sourceWithoutPreviews)
 * // Output:
 * // function Component() {
 * //   return (
 * //     <div>Hello World</div>
 * //   )
 * // }
 * ```
 * @deprecated this is done automatically by the vite plugin backend.
 */
export function extractPreviewsAndCleanSource(code: string): ExtractedPreview {
  const lines = code.split("\n")
  const previewBlocks: PreviewBlock[] = []
  const cleanedLines: string[] = []

  let inPreview = false
  let currentBlock: string[] = []
  let startLine = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    if (isPreviewLine(trimmedLine)) {
      if (inPreview) {
        // End of preview block - save it and don't include marker in cleaned source
        previewBlocks.push({
          content: currentBlock.join("\n"),
          endLine: i - 1,
          startLine,
        })
        currentBlock = []
        inPreview = false
      } else {
        // Start of preview block - don't include marker in cleaned source
        inPreview = true
        startLine = i + 1
      }
    } else {
      cleanedLines.push(line)

      if (inPreview) {
        currentBlock.push(line)
      }
    }
  }

  return {
    formattedPreview: dedent(
      previewBlocks.map((block) => block.content).join("\n"),
    ),
    previewBlocks,
    sourceWithoutPreviews: cleanedLines.join("\n"),
  }
}

/**
 * Matches JSX / normal JS preview snippets.
 */
export function isPreviewLine(trimmedLine: string): boolean {
  return (
    trimmedLine === "// preview" ||
    /^\{\s*\/\*\s*preview\s*\*\/\s*\}$/.test(trimmedLine)
  )
}

export function isImportLine(trimmedLine: string): boolean {
  return trimmedLine.startsWith("import")
}

export function getDefaultSourceCode(): SourceCodeData {
  return {
    fileName: "",
    highlighted: {
      full: "",
    },
    raw: {
      full: "",
      preview: "",
      withoutImports: "",
    },
  }
}
