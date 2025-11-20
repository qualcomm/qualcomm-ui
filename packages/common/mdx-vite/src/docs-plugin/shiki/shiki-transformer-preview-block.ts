// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ShikiTransformer} from "shiki"

interface TransformerPreviewBlockOptions {
  stripMarkers?: boolean
}

function isPreviewLine(trimmedLine: string): boolean {
  return (
    trimmedLine === "// preview" ||
    /^\{\s*\/\*\s*preview\s*\*\/\s*\}$/.test(trimmedLine) ||
    /^<!--\s*preview\s*-->$/.test(trimmedLine)
  )
}

export function transformerPreviewBlock(
  options: TransformerPreviewBlockOptions = {},
): ShikiTransformer {
  const {stripMarkers = true} = options
  let previewContent: string | null = null

  return {
    name: "transformer-preview-block",
    pre(node) {
      if (previewContent) {
        node.properties["data-preview"] = previewContent
      }
    },
    preprocess(code) {
      previewContent = null
      const lines = code.split("\n")
      const resultLines: string[] = []
      const previewLines: string[] = []
      let inPreview = false
      let foundPreview = false

      for (const line of lines) {
        const trimmed = line.trim()
        if (isPreviewLine(trimmed)) {
          if (!inPreview) {
            inPreview = true
            foundPreview = true
          } else {
            inPreview = false
          }
          if (!stripMarkers) {
            resultLines.push(line)
          }
          continue
        }
        resultLines.push(line)
        if (inPreview) {
          previewLines.push(line)
        }
      }

      if (foundPreview) {
        previewContent = previewLines.join("\n").trim()
      }
    },
  }
}
