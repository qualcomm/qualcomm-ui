// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FunctionComponent} from "react"

export interface CodeSource {
  code: string
  fileName: string

  /**
   * @default 'tsx'
   */
  language?: string
}

export interface CodeDemoNode {
  component: FunctionComponent
  source: CodeSource[]
}
