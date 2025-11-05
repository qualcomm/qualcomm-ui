// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export type NodeType =
  | "root"
  | "block"
  | "open"
  | "close"
  | "text"
  | "line"
  | "newline"

interface TextNodeOptions {
  /** The regex match array, if any */
  match?: RegExpExecArray
  /** For block‐close tokens we sometimes capture a newline */
  newline?: string
  /** Which kind of token this is */
  type: NodeType
  /** The literal text value (may be empty) */
  value: string
}

interface TextBlockOptions extends TextNodeOptions {
  nodes?: TextNode[]
}

class TextNode {
  readonly type: NodeType
  value: string
  readonly match?: RegExpExecArray
  readonly newline: string

  constructor({match, newline = "", type, value}: TextNodeOptions) {
    this.type = type
    this.value = value
    this.match = match
    this.newline = newline
  }

  /**
   * True if this token had a `!` marker,
   * e.g. `/**!` or `//!`
   */
  get protected(): boolean {
    return Boolean(this.match && this.match[1] === "!")
  }
}

class TextBlock extends TextNode {
  readonly nodes: TextNode[]

  constructor({
    match,
    newline = "",
    nodes = [],
    type,
    value,
  }: TextBlockOptions) {
    super({match, newline, type, value})
    this.nodes = nodes
  }

  /**
   * Push any TextNode (including nested TextBlock)
   */
  push(node: TextNode) {
    this.nodes.push(node)
  }

  /**
   * A block is “protected” if its first child is
   * a protected token
   */
  override get protected(): boolean {
    return this.nodes.length > 0 && this.nodes[0].protected
  }
}

/** Our various scanning regexes */
const constants = {
  BLOCK_CLOSE_REGEX: /^\*\/(\n?)/,
  BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/,
  ESCAPED_CHAR_REGEX: /^\\./,
  LINE_REGEX: /^\/\/(!?).*/,
  NEWLINE_REGEX: /^\r*\n/,
  QUOTED_STRING_REGEX: /^(['"`])((?:\\.|[^\x01])*?)(\1)/,
}

export function strip(input: string): string {
  const {
    BLOCK_CLOSE_REGEX,
    BLOCK_OPEN_REGEX,
    ESCAPED_CHAR_REGEX,
    LINE_REGEX,
    NEWLINE_REGEX,
    QUOTED_STRING_REGEX,
  } = constants

  // Create the root AST node
  const cst = new TextBlock({
    nodes: [],
    type: "root",
    value: "",
  })
  const stack: TextBlock[] = [cst]
  let block = cst
  let remaining = input
  let prev: TextNode | undefined

  /** Consume characters from `remaining` */
  const consume = (text = remaining[0] || ""): string => {
    remaining = remaining.slice(text.length)
    return text
  }

  /**
   * Try to match `regex` against the front of `remaining`.
   * If it matches, we consume it and return a token.
   */
  const scan = (regex: RegExp, type: NodeType): TextNodeOptions | undefined => {
    const match = regex.exec(remaining)
    if (!match) {
      return
    }
    const value = match[0]
    consume(value)
    return {match, type, value}
  }

  /**
   * Push a node into the current block.
   * If both the previous node and this one are plain text,
   * we merge them to keep things tidy.
   */
  const pushNode = (node: TextNode) => {
    if (prev?.type === "text" && node.type === "text") {
      prev.value += node.value
      return
    }
    block.push(node)

    // If it's a nested block, descend into it
    if (node.type === "block") {
      stack.push(node as TextBlock)
      block = node as TextBlock
    }
    prev = node
  }

  /** Pop one level of block nesting */
  const popBlock = () => {
    if (block.type === "root") {
      throw new SyntaxError("Unclosed block comment")
    }
    stack.pop()
    block = stack[stack.length - 1]
  }

  // Main parse loop
  while (remaining.length > 0) {
    let token: TextNodeOptions | undefined

    // 1) Escaped char: “\x”
    if ((token = scan(ESCAPED_CHAR_REGEX, "text"))) {
      pushNode(new TextNode(token))
      continue
    }

    // 2) Quoted strings (only outside block comments,
    //    and only if prev doesn't end in an identifier)
    if (
      block.type !== "block" &&
      (!prev || !/\w$/.test(prev.value)) &&
      (token = scan(QUOTED_STRING_REGEX, "line"))
    ) {
      pushNode(new TextNode(token))
      continue
    }

    // 3) Newlines
    if ((token = scan(NEWLINE_REGEX, "newline"))) {
      pushNode(new TextNode(token))
      continue
    }

    // 4) Block open: /**  or /*!  or /*
    if ((token = scan(BLOCK_OPEN_REGEX, "open"))) {
      pushNode(new TextBlock({nodes: [], type: "block", value: ""}))
      pushNode(new TextNode(token))
      continue
    }

    // 5) Block close (only inside a block)
    if (block.type === "block" && (token = scan(BLOCK_CLOSE_REGEX, "close"))) {
      // carry the newline if captured
      token.newline = token.match![1] || ""
      pushNode(new TextNode(token))
      popBlock()
      continue
    }

    // 6) Line comment (only outside block)
    if (block.type !== "block" && (token = scan(LINE_REGEX, "line"))) {
      pushNode(new TextNode(token))
      continue
    }

    // 7) Fallback: single character as text
    const ch = consume()
    pushNode(new TextNode({type: "text", value: ch}))
  }

  // Now compile the CST back to a string, dropping comments
  const compile = (node: TextBlock): string => {
    let out = ""
    for (const child of node.nodes) {
      switch (child.type) {
        // drop entire comment blocks and lines:
        case "block":
        case "line":
          break

        // emit everything else:
        case "open":
        case "close":
        case "text":
        case "newline":
        default:
          out += child.value
      }
    }
    return out
  }

  return compile(cst)
}
