// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ShikiTransformer} from "shiki"

import {removeCodeAnnotations} from "./utils"

export interface TransformerCodeAttributeOptions {
  /**
   * The name of the attribute to add to the pre element.
   *
   * @default 'data-code'
   */
  attributeName?: string

  /**
   * Custom formatter for the source code.
   */
  formatter?: (code: string) => string
}

/**
 * Adds a `data-code` attribute to the `<pre>` element with the code contents,
 * removing any code annotations and unused lines from transformers like
 * `transformerNotationDiff`.
 */
export function transformerCodeAttribute(
  opts: TransformerCodeAttributeOptions = {},
): ShikiTransformer {
  return {
    enforce: "post",
    name: "shiki-transformer-code-attribute",
    pre(node) {
      const strippedSource = removeCodeAnnotations(this.source)
      node.properties[opts.attributeName ?? "data-code"] =
        opts.formatter?.(strippedSource) ?? strippedSource
    },
  }
}
