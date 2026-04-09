// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import {type PluggableList, unified} from "unified"

import type {PageFrontmatter} from "@qualcomm-ui/mdx-common"

import {
  remarkAlerts,
  remarkExtractMeta,
  remarkFrontmatterInterpolation,
  remarkRemoveJsx,
  remarkRemoveMermaidCodeBlocks,
} from "../remark"

export interface RemarkPipelineOptions {
  /** GitHub-style alert blocks. */
  alerts?: boolean
  /**
   * Strip :::meta::: and :::terms::: blocks, storing extracted data in the provided
   * object.
   */
  extractMeta?: Record<string, string | string[]>
  /** Include remarkFrontmatter for YAML front matter. */
  frontmatter?: boolean
  /** Include remarkGfm for GitHub Flavored Markdown. */
  gfm?: boolean
  /** Interpolate {frontmatter.*} expressions in the content. */
  interpolateFrontmatter?: PageFrontmatter
  /** Include remarkMdx for MDX parsing. */
  mdx?: boolean
  /**
   * "md" appends remarkStringify; "none" (default) leaves serialization to the
   * caller.
   */
  output?: "md" | "none"
  /** Additional remark plugins appended after built-in transforms. */
  plugins?: PluggableList
  /** Strip JSX/MDX elements from the AST. */
  removeJsx?: boolean
  /** Remove mermaid code blocks. */
  removeMermaidCodeBlocks?: boolean
}

/**
 * Creates a configured unified remark processor. The caller can further extend
 * the returned processor with `.use()` (e.g. to add remarkRehype for HTML output).
 */
export function createRemarkProcessor(options: RemarkPipelineOptions = {}) {
  const processor = unified().use(remarkParse)

  if (options.mdx) {
    processor.use(remarkMdx)
  }
  if (options.frontmatter) {
    processor.use(remarkFrontmatter, ["yaml"])
  }

  // Transform plugins — order matters
  if (options.removeJsx) {
    processor.use(remarkRemoveJsx)
  }
  if (options.removeMermaidCodeBlocks) {
    processor.use(remarkRemoveMermaidCodeBlocks)
  }
  if (options.gfm) {
    processor.use(remarkGfm)
  }
  if (options.alerts) {
    processor.use(remarkAlerts)
  }
  if (options.interpolateFrontmatter) {
    processor.use(
      remarkFrontmatterInterpolation,
      options.interpolateFrontmatter,
    )
  }
  if (options.extractMeta) {
    processor.use(remarkExtractMeta, options.extractMeta)
  }

  if (options.plugins) {
    for (const plugin of options.plugins) {
      if (Array.isArray(plugin)) {
        processor.use(...plugin)
      } else {
        // @ts-expect-error mdast types
        processor.use(plugin)
      }
    }
  }

  if (options.output === "md") {
    processor.use(remarkStringify)
  }

  return processor
}
