// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ShikiTransformer} from "shiki"

import {dedent} from "@qualcomm-ui/utils/dedent"

import {removeCodeAnnotations} from "./utils.js"

export type PreviewDisplayMode = "only-preview" | "full-code"

export interface PreviewBlockTransformerOptions {
  /**
   * The name of the attribute to add to the pre element. Supply as `null` to
   * disable.
   *
   * @default 'data-preview'
   */
  attributeName?: string | null

  /**
   * @option 'full-code': keep the full code (with preview markers removed) as the rendered snippet.
   * @option 'preview-only': render only the extracted preview block as the snippet
   *
   * In all cases the preview block is extracted and attached to `data-preview`.
   *
   * @default 'full-code'
   */
  displayMode?: PreviewDisplayMode

  /**
   * Callback fired when file processing is complete.
   */
  onComplete?: (extractedPreview: string | null) => void
}

export function isPreviewLine(trimmedLine: string): boolean {
  return (
    trimmedLine === "// preview" ||
    /^\{\s*\/\*\s*preview\s*\*\/\s*\}$/.test(trimmedLine) ||
    /^<!--\s*preview\s*-->$/.test(trimmedLine)
  )
}

export function transformerPreviewBlock(
  options: PreviewBlockTransformerOptions = {
    displayMode: "full-code",
  },
): ShikiTransformer {
  let previewContent: string | null = null
  let previewStartLine = -1
  let previewEndLine = -1
  let currentLine = 0

  return {
    enforce: "post",
    line(node) {
      if (currentLine >= previewStartLine && currentLine <= previewEndLine) {
        node.properties["data-preview-line"] = "true"
      }
      currentLine++
    },
    name: "transformer-preview-block",
    pre(node) {
      const content = previewContent
        ? removeCodeAnnotations(previewContent)
        : null
      if (content && options.attributeName != null) {
        node.properties[options.attributeName] = content
      }
      options.onComplete?.(content || null)
    },
    preprocess(code) {
      previewContent = null
      currentLine = 0
      previewStartLine = -1
      previewEndLine = -1

      const lines = code.split("\n")
      const resultLines: string[] = []
      const previewLines: string[] = []
      let inPreview = false
      let foundPreview = false
      let outputLineIndex = 0

      for (const line of lines) {
        const trimmed = line.trim()
        if (isPreviewLine(trimmed)) {
          if (!inPreview) {
            inPreview = true
            foundPreview = true
            previewStartLine = outputLineIndex
          } else {
            inPreview = false
            previewEndLine = outputLineIndex - 1
          }
          continue
        }
        resultLines.push(line)
        if (inPreview) {
          previewLines.push(line)
        }
        outputLineIndex++
      }

      if (foundPreview) {
        previewContent = dedent(previewLines.join("\n").trim())
        if (options.displayMode === "only-preview") {
          return previewContent
        }
      }
      return resultLines.join("\n").trim()
    },
  }
}
