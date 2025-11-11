// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {transform as _transform} from "sucrase"

export function transform(code: string): string {
  return _transform(code, {
    production: true,
    transforms: ["jsx", "typescript", "imports"],
  }).code.substring(13) // remove leading `"use strict";`
}

const firstStatementRegexp =
  /^(\s*)(<[^>]*>|function[(\s]|\(\)[\s=]|class\s)(.*)/

export function normalizeCode(code: string): string {
  return code.replace(firstStatementRegexp, "$1export default $2$3")
}
