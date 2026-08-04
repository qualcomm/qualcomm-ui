// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ShikiTransformer} from "shiki"

import {removeCodeAnnotations} from "./utils.js"

export interface TransformerCodeAttributeOptions {
  /**
   * The name of the attribute to add to the pre element. Supply as `null` to
   * disable.
   *
   * @default 'data-code'
   */
  attributeName?: string | null

  /**
   * Custom formatter for the source code.
   */
  formatter?: (code: string) => string

  /**
   * Callback fired when file processing is complete.
   */
  onComplete?: (codeWithoutSnippets: string) => void
}

/**
 * Adds a `data-code` attribute to the `<pre>` element with the code contents,
 * removing any code annotations and unused lines from transformers like
 * `transformerNotationDiff`.
 */
export function transformerCodeAttribute(
  opts: TransformerCodeAttributeOptions = {attributeName: "data-code"},
): ShikiTransformer {
  return {
    enforce: "post",
    name: "shiki-transformer-code-attribute",
    pre(node) {
      const strippedSource = removeCodeAnnotations(this.source)
      const formattedSource = opts.formatter?.(strippedSource) ?? strippedSource
      if (opts.attributeName !== null) {
        node.properties[opts.attributeName ?? "data-code"] = formattedSource
      }
      opts.onComplete?.(formattedSource)
    },
  }
}
