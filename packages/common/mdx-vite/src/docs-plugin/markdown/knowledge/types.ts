// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Root} from "mdast"

import type {PageEntry, SectionEntry} from "@qualcomm-ui/mdx-common"
import type {QuiComment} from "@qualcomm-ui/typedoc-common"

export interface ImportedModule {
  content: string
  path: string
}

export interface ComponentProps {
  comment?: QuiComment
  input?: PropInfo[]
  name: string
  output?: PropInfo[]
  props?: PropInfo[]
}

export interface DocProps {
  props: Record<string, ComponentProps>
}

export interface PropInfo {
  comment?: QuiComment
  defaultValue?: string
  name: string
  resolvedType?: {
    baseType?: string
    name?: string
    prettyType?: string
    required?: boolean
    type?: string
  }
  type: string
}

export interface ProcessedPage {
  content: string
  frontmatter: Record<string, unknown>
  /** Content before meta blocks are stripped, used for section extraction */
  rawContent: string
  /** AST with data nodes preserved, used for section extraction */
  sectionAst: Root
  title: string
  url: string | undefined
}

export interface MdxFlowExpression {
  type: "mdxFlowExpression"
  value: string
}

export interface KnowledgePageCacheEntry {
  contentHash: string
  pageEntry: PageEntry | null
  processedPage: ProcessedPage
  sections: SectionEntry[]
}

export type KnowledgePageCache = Map<string, KnowledgePageCacheEntry>
