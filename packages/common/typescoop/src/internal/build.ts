// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ParseResult} from "../extractor/index.js"
import {TypeParser} from "../type-parser.js"
import type {BuildOptions} from "../types.js"

/**
 * Generates and writes the documentation model. Pass a {@link TypeParser} to
 * reuse its previous program across builds.
 */
export async function build(
  config: string | BuildOptions | TypeParser,
): Promise<ParseResult> {
  const typeParser =
    config instanceof TypeParser ? config : new TypeParser(config)

  const result = await typeParser.build()

  await typeParser.export(result)
  await typeParser.printFileMetrics()

  return result
}
