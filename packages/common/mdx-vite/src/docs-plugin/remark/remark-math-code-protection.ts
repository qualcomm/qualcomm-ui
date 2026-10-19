// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Root} from "mdast"
import type {Options as MarkdownOptions} from "mdast-util-from-markdown"
import type {Plugin} from "unified"

type Extension = NonNullable<MarkdownOptions["extensions"]>[number]
type Construct = Extract<
  NonNullable<Extension["text"]>[number],
  {tokenize: unknown}
>
type State = ReturnType<Construct["tokenize"]>

/**
 * Math tokens do not expose CommonMark characterEscape events. Check the span
 * with an isolated previous-character context after validating its opener,
 * including when an escaped backtick immediately precedes that opener.
 */
const codeSpanLookahead: Construct = {
  partial: true,
  tokenize(effects, ok, nok) {
    const constructs = this.parser.constructs.text[96]
    const codeText = (
      Array.isArray(constructs) ? constructs : [constructs]
    ).find((construct) => construct?.name === "codeText")

    if (
      !codeText ||
      this.parser.constructs.disable.null?.includes("codeText")
    ) {
      return nok
    }

    return codeText.tokenize.call({...this, previous: null}, effects, ok, nok)
  },
}

function protectMathConstruct(construct: Construct): Construct {
  if (construct.name !== "mathText") {
    return construct
  }

  return {
    ...construct,
    tokenize(effects, ok, nok) {
      let active = true
      let escaped = false
      let previousBacktickEscaped = false

      const reject: State = (code) => {
        active = false
        return nok(code)
      }
      const accept: State = (code) => {
        active = false
        return ok(code)
      }

      const protect = (state: State): State => {
        const advance: State = (code) => {
          previousBacktickEscaped = code === 96 && escaped
          escaped = code === 92 && !escaped
          const next = state(code)
          return next && protect(next)
        }

        return (code) => {
          if (!active) {
            return state(code)
          }

          if (
            code === 96 &&
            !escaped &&
            (this.previous !== 96 || previousBacktickEscaped)
          ) {
            return effects.check(codeSpanLookahead, reject, advance)(code)
          }

          return advance(code)
        }
      }

      return protect(construct.tokenize.call(this, effects, accept, reject))
    },
  }
}

function protectMathExtension(extension: Extension): Extension {
  const construct = extension.text?.[36]
  if (!construct) {
    return extension
  }

  return {
    ...extension,
    text: {
      ...extension.text,
      36: Array.isArray(construct)
        ? construct.map(protectMathConstruct)
        : protectMathConstruct(construct),
    },
  }
}

/**
 * Prevents an earlier prose dollar sign from consuming a code span as math.
 * CommonMark's code tokenizer checks matching backtick runs without consuming
 * them; a match rejects the math construct so normal code parsing can proceed.
 */
export const remarkMathCodeProtection: Plugin<[], string, Root> = function () {
  const parser = this.parser
  if (!parser) {
    return
  }

  let configured = false
  this.parser = (document, file) => {
    /**
     * Sites can register remark-math after getRemarkPlugins(). Wait until parsing
     * starts, when all plugins have registered their syntax extensions.
     */
    if (!configured) {
      const data = this.data()
      if (data.micromarkExtensions) {
        data.micromarkExtensions =
          data.micromarkExtensions.map(protectMathExtension)
      }
      configured = true
    }

    return parser(document, file)
  }
}
