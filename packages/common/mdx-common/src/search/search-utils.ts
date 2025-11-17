// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type Fuzzysort from "fuzzysort"

import type {PageSection} from "../docs-plugin.types"

import type {
  FormattedContent,
  SearchResult,
  SearchResultFields,
  SearchResultType,
} from "./search.types"

function findWordBoundary(
  text: string,
  index: number,
  direction: "left" | "right",
): number {
  if (direction === "left") {
    while (index > 0 && !/\s/.test(text[index])) {
      index--
    }
    return Math.max(0, index)
  }
  while (index < text.length && !/\s/.test(text[index])) {
    index++
  }
  return Math.min(text.length, index)
}

/**
 * This function uses a Sliding Window technique to keep the matched search text in
 * view as the user types.
 */
export function formatSectionContent(
  text: string,
  indices: readonly number[],
  characterLimit = 150,
): FormattedContent[] {
  const startIndex = indices[0]
  const endIndex = indices[indices.length - 1]
  const matchedIndices = new Set(indices)
  const matched: FormattedContent[] = []

  const halfLimit = Math.floor(characterLimit / 2)

  let windowStart = Math.max(startIndex - halfLimit, 0)
  let windowEnd = Math.min(endIndex + halfLimit, text.length)

  if (windowEnd - windowStart > characterLimit) {
    if (windowStart === 0) {
      windowEnd = characterLimit
    } else {
      windowStart = windowEnd - characterLimit
    }
  }

  windowStart = findWordBoundary(text, windowStart, "left")
  windowEnd = findWordBoundary(text, windowEnd, "right")

  for (let i = windowStart; i < windowEnd; i++) {
    const char = text.charAt(i)
    matched.push({content: char, highlight: matchedIndices.has(i)})
  }

  const content: FormattedContent[] = []
  let chars: string[] = [matched[0].content]
  for (let i = 1; i < matched.length; i++) {
    const prev = matched[i - 1]
    const current = matched[i]
    if (current.highlight === prev?.highlight) {
      chars.push(current.content)
    } else {
      content.push({content: chars.join(""), highlight: prev?.highlight})
      chars = [current.content]
    }
  }

  if (chars.length) {
    content.push({
      content: chars.join(""),
      highlight: matched[matched.length - 1].highlight,
    })
  }

  const totalContentLength = content.reduce((acc, content) => {
    return acc + content.content.length
  }, 0)

  if (text.length !== totalContentLength && windowStart > 0) {
    return [{content: "...", highlight: false}, ...content]
  }

  return content
}

interface ResultWithType
  extends Pick<Fuzzysort.Result, "indexes" | "score" | "target"> {
  type: SearchResultType
}

function formatKeyResult(
  result: Fuzzysort.Result,
  type: SearchResultType,
): ResultWithType {
  return {
    indexes: result.indexes,
    score: result.score,
    target: result.target,
    type,
  }
}

/**
 * Plucks the fields that we want out of the IndexedPage.
 */
function getFields(obj: PageSection): SearchResultFields {
  return {
    categories: obj.categories,
    heading: obj.heading,
    headingLevel: obj.headingLevel,
    href: obj.href ? obj.href : obj.pathname,
    id: obj.id,
    isDocProp: obj.isDocProp,
    title: obj.title,
  }
}

/**
 * Formats search results from Fuzzysort.
 */
export function formatSearchResults(
  results: Fuzzysort.KeysResults<PageSection>,
  characterLimit: number = 150,
): SearchResult[] {
  return results.map((res) => {
    const heading = formatKeyResult(res[1], "heading")
    const content = formatKeyResult(res[2], "content")
    const obj: PageSection = res.obj
    const resultType: SearchResultType =
      content.score > 0.2 ? "content" : heading.score ? "heading" : "title"
    const result = {
      ...getFields(obj),
      index: -1,
      score: res.score,
      type: resultType,
    }
    if (resultType === "content" && obj.content) {
      return {
        ...result,
        content: formatSectionContent(
          obj.content,
          content.indexes,
          characterLimit,
        ),
      }
    }
    return result
  })
}
