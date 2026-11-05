// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Processor} from "unified"

export interface RemarkPosition {
  end?: {
    offset?: number
  }
  start?: {
    offset?: number
  }
}

export interface RemarkNode {
  children?: RemarkNode[]
  lang?: string | null
  position?: RemarkPosition
  type: string
  value?: string
}

export interface RemarkFile {
  message: (
    reason: string,
    place?: RemarkNode | {column: number; line: number},
    ruleId?: string,
  ) => unknown
  path?: string
  value?: unknown
}

export type RemarkTransformer = (
  tree: RemarkNode,
  file: RemarkFile,
) => Promise<void> | void

export type RemarkPlugin = (this: Processor) => RemarkTransformer | void
