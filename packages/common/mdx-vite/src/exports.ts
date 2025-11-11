// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import rehypeMdxCodeProps from "rehype-mdx-code-props"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"

import {rehypeSlug} from "./docs-plugin/rehype/rehype-slug"

// Re-export these peerDependencies for more convenient imports.
// Some of these are not included in the bundled JS, so the user must install them
// separately.
export {
  remarkFrontmatter,
  remarkGfm,
  remarkMdxFrontmatter,
  rehypeMdxCodeProps,
  rehypeSlug,
}
