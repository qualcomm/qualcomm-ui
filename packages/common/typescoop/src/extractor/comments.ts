// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import ts from "typescript"

import type {
  QuiComment,
  QuiCommentDisplayPart,
  QuiCommentTag,
} from "@qualcomm-ui/typedoc-common"

/**
 * Tags that carry no content. They are exposed through {@link
 * ParsedComment.modifiers} and omitted from the emitted block tags, matching
 * TypeDoc.
 */
const modifierTags = new Set([
  "@abstract",
  "@alpha",
  "@beta",
  "@event",
  "@eventProperty",
  "@experimental",
  "@hidden",
  "@ignore",
  "@interface",
  "@internal",
  "@override",
  "@packageDocumentation",
  "@private",
  "@protected",
  "@public",
  "@readonly",
  "@sealed",
  "@virtual",
])

/**
 * Block tags consumed by the extractor. They configure the output instead of
 * being rendered as documentation.
 */
const consumedTags = new Set([
  "@category",
  "@docLink",
  "@param",
  "@template",
  "@typeParam",
])

/**
 * Tags without content that may trail the text of a line.
 */
const inlineModifiers = new Set([...modifierTags, "@inheritDoc"])

/**
 * TypeDoc treats the content of these tags as code when it has no code fence.
 */
const codeTags = new Set(["@default", "@example"])

/**
 * Tag content that is already a single code span, such as `` `'md'` ``.
 */
const inlineCode = /^`[^`]+`$/

export interface ParsedTag {
  /**
   * The parameter name for `@param` and `@template` tags.
   */
  name?: string
  tag: string
  text: string
}

export interface ParsedComment {
  modifiers: Set<string>
  summary: string
  tags: ParsedTag[]
}

const emptyComment: ParsedComment = {
  modifiers: new Set(),
  summary: "",
  tags: [],
}

function stripCommentSyntax(raw: string): string[] {
  return raw
    .replace(/^\/\*\*/, "")
    .replace(/\*\/$/, "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*\* ?/, ""))
}

/**
 * Parses the raw text of a `/** *\/` comment. TypeScript's own JSDoc parser
 * splits URLs in `{@link https://...}` into an identifier and trailing text, so
 * the comment is parsed from source instead.
 */
export function parseCommentText(raw: string): ParsedComment {
  const sections: {lines: string[]; tag?: string}[] = [{lines: []}]
  let inFence = false
  for (const line of stripCommentSyntax(raw)) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence
    }
    const tagMatch = !inFence && /^\s*(@\w+)\s?(.*)$/.exec(line)
    if (tagMatch) {
      sections.push({lines: [tagMatch[2]], tag: tagMatch[1]})
      continue
    }
    // TypeDoc also reads content-free tags at the end of a line, such as
    // `Props for the backdrop. @inheritDoc`.
    const trailing = !inFence && /^(.*\S)\s+(@\w+)\s*$/.exec(line)
    if (trailing && inlineModifiers.has(trailing[2])) {
      sections.at(-1)!.lines.push(trailing[1])
      sections.push({lines: [], tag: trailing[2]})
    } else {
      sections.at(-1)!.lines.push(line)
    }
  }

  const [summarySection, ...tagSections] = sections
  const modifiers = new Set<string>()
  const tags: ParsedTag[] = []
  for (const section of tagSections) {
    const tag = section.tag!
    const text = section.lines.join("\n").trim()
    if (modifierTags.has(tag)) {
      modifiers.add(tag)
      continue
    }
    if (tag === "@param" || tag === "@template" || tag === "@typeParam") {
      const paramMatch =
        /^(?:\{[^}]*\}\s*)?\[?([\w$.]+)[^\s\]]*\]?\s*(?:-\s*)?([\s\S]*)$/.exec(
          text,
        )
      tags.push({name: paramMatch?.[1], tag, text: paramMatch?.[2] ?? ""})
      continue
    }
    tags.push({tag, text})
  }

  return {modifiers, summary: summarySection.lines.join("\n").trim(), tags}
}

function getJsDocNode(node: ts.Node): ts.JSDoc | undefined {
  // `export const [a, b] = ...` keeps its comment on the variable statement.
  while (
    ts.isBindingElement(node) ||
    ts.isArrayBindingPattern(node) ||
    ts.isObjectBindingPattern(node)
  ) {
    node = node.parent
  }
  const target =
    ts.isVariableDeclaration(node) &&
    ts.isVariableDeclarationList(node.parent) &&
    ts.isVariableStatement(node.parent.parent)
      ? node.parent.parent
      : node
  const docs = ts.getJSDocCommentsAndTags(target).filter(ts.isJSDoc)
  return docs.at(-1)
}

const commentCache = new WeakMap<ts.Node, ParsedComment>()

export function getNodeComment(node: ts.Node | undefined): ParsedComment {
  if (!node) {
    return emptyComment
  }
  let parsed = commentCache.get(node)
  if (!parsed) {
    const jsDoc = getJsDocNode(node)
    parsed = jsDoc ? parseCommentText(jsDoc.getText()) : emptyComment
    commentCache.set(node, parsed)
  }
  return parsed
}

/**
 * Returns the comment of the first declaration that has one.
 */
export function getSymbolComment(symbol: ts.Symbol | undefined): ParsedComment {
  for (const declaration of symbol?.declarations ?? []) {
    const parsed = getNodeComment(declaration)
    if (parsed.summary || parsed.tags.length || parsed.modifiers.size) {
      return parsed
    }
  }
  return emptyComment
}

export function hasComment(comment: ParsedComment): boolean {
  return (
    !!comment.summary || comment.tags.some((tag) => !consumedTags.has(tag.tag))
  )
}

export function findTag(
  comment: ParsedComment,
  tag: string,
): ParsedTag | undefined {
  return comment.tags.find((parsedTag) => parsedTag.tag === tag)
}

const inlinePattern =
  /(```[\s\S]*?```)|(`[^`]+`)|\{@(link|linkcode|linkplain)\s+([^}]*)\}/g

function parseLink(content: string): {target?: string; text: string} {
  const trimmed = content.trim()
  const pipe = trimmed.indexOf("|")
  const [target, label] =
    pipe === -1
      ? [
          trimmed.split(/\s/, 1)[0],
          trimmed.slice(trimmed.split(/\s/, 1)[0].length).trim(),
        ]
      : [trimmed.slice(0, pipe).trim(), trimmed.slice(pipe + 1).trim()]
  if (/^https?:\/\//.test(target)) {
    return {target, text: label || target}
  }
  return {text: label || target}
}

export function toDisplayParts(text: string): QuiCommentDisplayPart[] {
  const parts: QuiCommentDisplayPart[] = []
  let lastIndex = 0
  for (const match of text.matchAll(inlinePattern)) {
    if (match.index > lastIndex) {
      parts.push({kind: "text", text: text.slice(lastIndex, match.index)})
    }
    if (match[1] || match[2]) {
      parts.push({kind: "code", text: match[0]})
    } else {
      parts.push({
        kind: "inline-tag",
        tag: `@${match[3]}`,
        ...parseLink(match[4]),
      })
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push({kind: "text", text: text.slice(lastIndex)})
  }
  return parts
}

function tagContent(tag: ParsedTag): QuiCommentDisplayPart[] {
  if (
    codeTags.has(tag.tag) &&
    tag.text &&
    !tag.text.includes("```") &&
    !inlineCode.test(tag.text.trim())
  ) {
    return [{kind: "code", text: `\`\`\`ts\n${tag.text}\n\`\`\``}]
  }
  return toDisplayParts(tag.text)
}

export interface CommentTransformOptions {
  /**
   * Adds a doc link to `@see` parts that name a documented type.
   */
  resolveDocLink?: (name: string) => string | undefined
}

export function toQuiComment(
  comment: ParsedComment,
  options: CommentTransformOptions = {},
): QuiComment | undefined {
  const blockTags: QuiCommentTag[] = comment.tags
    .filter((tag) => !consumedTags.has(tag.tag))
    .map((tag) => {
      const content = tagContent(tag)
      if (tag.tag === "@see" && options.resolveDocLink) {
        return {
          content: content.map((part) => {
            const docLink = options.resolveDocLink!(part.text.trim())
            return docLink ? {...part, docLink} : part
          }),
          tag: tag.tag,
        }
      }
      return {content, tag: tag.tag}
    })
  const summary = toDisplayParts(comment.summary)
  if (!summary.length && !blockTags.length) {
    return undefined
  }
  return {blockTags: blockTags.length ? blockTags : undefined, summary}
}

/**
 * Formats `@default` the same way as the previous TypeDoc pipeline: code fences
 * and backticks are removed.
 */
export function getDefaultValue(comment: ParsedComment): string | undefined {
  const tag = findTag(comment, "@default")
  if (!tag) {
    return undefined
  }
  let text = tag.text.trim()
  const fenced = /^```\w*\n?([\s\S]*?)\n?```$/.exec(text)
  if (fenced) {
    text = fenced[1].trim()
  }
  // a default written as a single code span, such as `` `'md'` ``, is unwrapped.
  // Other backticks belong to the value, as in template literals.
  const span = /^`([^`]+)`$/.exec(text)
  return span ? span[1].trim() : text
}

export function getParamComment(
  comment: ParsedComment,
  tag: "@param" | "@template",
  name: string,
): QuiCommentDisplayPart[] | undefined {
  const found = comment.tags.find(
    (parsedTag) =>
      (parsedTag.tag === tag ||
        (tag === "@template" && parsedTag.tag === "@typeParam")) &&
      parsedTag.name === name,
  )
  return found?.text ? toDisplayParts(found.text) : undefined
}
