// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import rehypeShiki, {type RehypeShikiOptions} from "@shikijs/rehype"
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRemoveNotationEscape,
  transformerRenderIndentGuides,
} from "@shikijs/transformers"
import {merge} from "lodash-es"
import type {ShikiTransformer} from "shiki"
import type {PluggableList} from "unified"

import {quiCustomDarkTheme} from "@qualcomm-ui/mdx-common"

import {
  rehypeMdxCodeProps,
  remarkFrontmatter,
  remarkGfm,
  remarkMdxFrontmatter,
} from "../exports"

import {ConfigLoader, type ConfigLoaderOptions} from "./config"
import {rehypeSectionize, rehypeSlug, type RehypeSlugOptions} from "./rehype"
import {
  remarkAlerts,
  remarkCodeTabs,
  remarkFrontmatterDescription,
  remarkFrontmatterTitle,
  remarkSpoilers,
  remarkSteps,
} from "./remark"
import {remarkExtractMeta} from "./remark/remark-extract-meta"
import {transformerCodeAttribute, transformerNotationHidden} from "./shiki"

export interface QuiRehypePluginOptions extends ConfigLoaderOptions {
  rehypeShikiOptions?: Partial<RehypeShikiOptions>
}

export function getShikiTransformers(): ShikiTransformer[] {
  return [
    transformerNotationDiff(),
    transformerNotationFocus(),
    transformerNotationHighlight(),
    transformerNotationWordHighlight(),
    transformerNotationErrorLevel(),
    transformerNotationHidden(),
    transformerRenderIndentGuides(),
    transformerRemoveNotationEscape(),
  ]
}

/**
 * Used to retrieve all the rehype plugins required for QUI Docs MDX.
 * These should be passed to the `mdx` vite plugin from
 */
export function getRehypePlugins(
  options: QuiRehypePluginOptions = {},
): PluggableList {
  const config = new ConfigLoader(options).loadConfig()
  return [
    [rehypeMdxCodeProps, {enforce: "pre"}],
    [
      rehypeSlug,
      {allowedHeadings: config.headings} satisfies RehypeSlugOptions,
    ],
    rehypeSectionize,
    [
      rehypeShiki,
      merge(
        {
          defaultColor: "light-dark()",
          fallbackLanguage: "text",
          themes: {
            dark: quiCustomDarkTheme,
            light: "github-light-high-contrast",
          },
          transformers: [...getShikiTransformers(), transformerCodeAttribute()],
        } satisfies RehypeShikiOptions,
        options.rehypeShikiOptions,
      ),
    ],
  ]
}

/**
 * @returns every remark plugin needed for QUI Docs MDX.
 *
 * @example
 * ```ts
 * // in your vite config
 * plugins: [
 *   mdx({
 *     providerImportSource: "@mdx-js/react",
 *     rehypePlugins: [...getRehypePlugins()],
 *     remarkPlugins: [...getRemarkPlugins()],
 *   }),
 *   quiDocsPlugin(),
 *   // ... the rest of your plugins
 * ]
 * ```
 */
export function getRemarkPlugins(): PluggableList {
  return [
    remarkFrontmatter,
    remarkMdxFrontmatter,
    remarkGfm,
    remarkAlerts,
    remarkCodeTabs,
    remarkFrontmatterTitle,
    remarkFrontmatterDescription,
    remarkSpoilers,
    remarkSteps,
    remarkExtractMeta,
  ]
}
