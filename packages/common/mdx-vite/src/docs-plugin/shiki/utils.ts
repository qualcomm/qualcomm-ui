// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export function removeCodeAnnotations(code: string): string {
  const hideAnnotationRegex = /\/\/\s*\[!code\s+hide(?::\d+)?\]/
  const removedDiffAnnotationRegex = /\/\/\s*\[!code\s+--\]/
  const lineAnnotationRegex = /\/\/\s*\[!code\s*(?:\S.*)?\]/
  const jsxBlockAnnotationRegex = /\{\s*\/\*\s*\[!code(?:\s+\S+)?\]\s*\*\/\s*\}/
  const htmlAnnotationRegex = /<!--\s*\[!code(?:\s+\S+)?\]\s*-->/
  const blockAnnotationRegex = /\/\*\s*\[!code(?:\s+\S+)?\]\s*\*\/\s*/
  const inlineIncrementRegex = /(?:\/\/\s*)?\[!code \+\+\]/

  function stripAnnotations(line: string): {
    hasHideAnnotation: boolean
    processed: string
    touched: boolean
  } {
    let processed = line
    let touched = false
    const hasHideAnnotation = hideAnnotationRegex.test(line)
    const hasRemovedDiffAnnotation = removedDiffAnnotationRegex.test(line)

    const patterns = [
      inlineIncrementRegex,
      jsxBlockAnnotationRegex,
      htmlAnnotationRegex,
      blockAnnotationRegex,
      lineAnnotationRegex,
    ]

    for (const pattern of patterns) {
      const next = processed.replace(pattern, "")
      if (next !== processed) {
        touched = true
        processed = next
      }
    }

    return {
      hasHideAnnotation: hasHideAnnotation || hasRemovedDiffAnnotation,
      processed,
      touched,
    }
  }

  return code
    .split("\n")
    .map(stripAnnotations)
    .filter(({hasHideAnnotation, processed, touched}) => {
      if (hasHideAnnotation) {
        return false
      }

      const processedIsBlank = !processed.trim()
      if (touched && processedIsBlank) {
        return false
      }

      return true
    })
    .map(({processed}) => processed)
    .join("\n")
}

export function extractPreviewFromHighlightedHtml(
  highlightedHtml: string,
): string | null {
  const preMatch = highlightedHtml.match(/<pre((?:\s+[\w-]+="[^"]*")*)>/)
  const codeMatch = highlightedHtml.match(/<code([^>]*)>(.*?)<\/code>/s)

  if (!preMatch || !codeMatch) {
    return null
  }
  const codeContent = codeMatch[2]
  const parts = codeContent.split(/<span class="line/)
  const previewLineParts = parts
    .slice(1)
    .filter((part) => part.includes('data-preview-line="true"'))

  // strip indentation
  const indents = previewLineParts.map((part) => {
    const indentMatches =
      part.match(/<span class="indent">(.+?)<\/span>/g) || []
    let total = 0
    for (const match of indentMatches) {
      const content = match.match(/<span class="indent">(.+?)<\/span>/)
      if (content) {
        total += content[1].length
      } else {
        break
      }
    }
    return total
  })

  const minIndent = Math.min(...indents.filter((n) => n > 0))
  const previewLines = previewLineParts.map((part) => {
    let processed = `<span class="line${part}`
    let remaining = minIndent
    while (remaining > 0 && processed.includes('<span class="indent">')) {
      const before = processed
      processed = processed.replace(
        /<span class="indent">(.+?)<\/span>/,
        (match, spaces) => {
          if (spaces.length <= remaining) {
            remaining -= spaces.length
            return ""
          } else {
            const kept = spaces.substring(remaining)
            remaining = 0
            return `<span class="indent">${kept}</span>`
          }
        },
      )
      if (before === processed) {
        break
      }
    }
    return processed
  })
  return `<pre${preMatch[1]}><code${codeMatch[1]}>${previewLines.join("")}</code></pre>`
}
