// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Config} from "eslint/config"

import recommended from "./recommended.js"

const mdxConfig: {configs: Record<"recommended", Config[]>} = {
  configs: {
    recommended,
  },
}

export default mdxConfig
