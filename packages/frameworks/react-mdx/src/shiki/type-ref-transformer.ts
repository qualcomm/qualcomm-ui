// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ShikiTransformer, ThemedToken} from "shiki"

/**
 * Type references as the tsx grammar scopes them. Namespaces, such as `Foo` in
 * `Foo.Bar`, and the name of a type declaration have scopes of their own.
 */
const typeReferenceScope = /^entity\.name\.type\.tsx?$/

function sliceToken(token: ThemedToken, start: number, end: number) {
  const {explanation: _explanation, ...rest} = token
  return {
    ...rest,
    content: token.content.slice(start, end),
    offset: token.offset + start,
  }
}

/**
 * Splits type references to the given names into tokens of their own, with a
 * `data-ref` attribute and a tab stop. Property keys, string literals, and
 * members of a namespace with the same text are left alone, so the tokens must
 * be highlighted with `includeExplanation`.
 */
export function typeRefTransformer(
  names: ReadonlySet<string>,
): ShikiTransformer {
  return {
    name: "qui:type-refs",
    tokens(lines) {
      let previousScope: string | undefined
      return lines.map((line) =>
        line.flatMap((token) => {
          const pieces: ThemedToken[] = []
          let cursor = 0
          let pieceStart = 0
          // a themed token can merge several grammar tokens of the same color,
          // and whitespace before them.
          for (const {content, scopes} of token.explanation ?? []) {
            const start = token.content.indexOf(content, cursor)
            if (start < 0) {
              break
            }
            cursor = start + content.length
            const scope = scopes.at(-1)?.scopeName
            const isRef =
              names.has(content) &&
              !!scope &&
              typeReferenceScope.test(scope) &&
              !previousScope?.startsWith("punctuation.accessor")
            if (content.trim()) {
              previousScope = scope
            }
            if (!isRef) {
              continue
            }
            if (start > pieceStart) {
              pieces.push(sliceToken(token, pieceStart, start))
            }
            pieces.push({
              ...sliceToken(token, start, cursor),
              htmlAttrs: {
                ...token.htmlAttrs,
                "data-ref": content,
                tabindex: "0",
              },
            })
            pieceStart = cursor
          }
          if (!pieces.length) {
            return [token]
          }
          if (pieceStart < token.content.length) {
            pieces.push(sliceToken(token, pieceStart, token.content.length))
          }
          return pieces
        }),
      )
    },
  }
}
