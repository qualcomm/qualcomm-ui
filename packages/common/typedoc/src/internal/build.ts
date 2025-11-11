// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {TypeParser} from "../type-parser"
import type {BuildOptions} from "../types"

import type {ParseResult} from "./types"

export async function build(config: string | BuildOptions) {
  const typeParser = new TypeParser(config)

  const json = await typeParser.build()
  if (!json) {
    return
  }
  const result: ParseResult = await typeParser.parseTypes(json)

  await typeParser.export(result)
  await typeParser.printFileMetrics()

  return result
}
