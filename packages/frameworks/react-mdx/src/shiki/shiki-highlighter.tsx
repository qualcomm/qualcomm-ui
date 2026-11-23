// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import QuickLru from "quick-lru"
import type {ShikiTransformer} from "shiki"
import type {CodeToHastOptions} from "shiki/types"

import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  dummyTypeName,
  shikiHighlighter,
  supportedLangs,
} from "./shiki-instance.js"
import {typeRefTransformer} from "./type-ref-transformer.js"

export interface ShikiHighlighterProps extends ElementRenderProp<"pre"> {
  cache?: boolean
  code: string
  langAlias?: Record<string, string>
  language?: string
  shikiConfig?: Omit<CodeToHastOptions, "themes" | "defaultColor" | "lang">

  /**
   * Type names to mark as refs. References to these types get a `data-ref`
   * attribute with the name and a tab stop.
   */
  typeRefs?: readonly string[]
}

const transformers: ShikiTransformer[] = [
  {
    postprocess(html: string) {
      const index = html.indexOf(dummyTypeName)
      if (index > -1) {
        return html
          .substring(
            // add 7 characters to account for the trailing </span>
            index + dummyTypeName.length + 7,
          )
          .replace(">=", ">")
      }
      return html
    },
  },
]

const shikiCache = new QuickLru<string, string>({maxSize: 1000})

export function ShikiHighlighter({
  cache,
  code,
  langAlias,
  language: languageProp,
  shikiConfig,
  typeRefs,
  ...props
}: ShikiHighlighterProps): ReactElement {
  // a key, so that a new array with the same names does not highlight again.
  const typeRefsKey = typeRefs?.join(" ") ?? ""

  const highlighted = useMemo(() => {
    const language = langAlias?.[languageProp ?? ""] ?? languageProp

    const resolvedConfig: CodeToHastOptions = {
      ...shikiConfig,
      ...(typeRefsKey ? {includeExplanation: "scopeName"} : {}),
      defaultColor: "light-dark()",
      lang: language && supportedLangs.has(language) ? language : "tsx",
      structure: "inline",
      themes: {
        dark: "dark",
        light: "light",
      },
    }

    // only cache if the config is serializable
    const shouldCache =
      cache &&
      !resolvedConfig?.grammarState?.getScopes &&
      !resolvedConfig?.grammarState?.getInternalStack &&
      !resolvedConfig?.transformers
    const cacheKey = shouldCache
      ? `${code}-${typeRefsKey}-${JSON.stringify(resolvedConfig)}`
      : ""
    if (shouldCache) {
      const cached = shikiCache.get(cacheKey)
      if (cached) {
        return cached
      }
    }

    const result = shikiHighlighter.codeToHtml(code, {
      ...resolvedConfig,
      transformers: typeRefsKey
        ? [typeRefTransformer(new Set(typeRefsKey.split(" "))), ...transformers]
        : transformers,
    })

    if (shouldCache) {
      shikiCache.set(cacheKey, result)
    }
    return result
  }, [cache, code, langAlias, languageProp, shikiConfig, typeRefsKey])

  const mergedProps = mergeProps({className: "shiki-code"}, props)

  return (
    <pre {...mergedProps} dangerouslySetInnerHTML={{__html: highlighted}}></pre>
  )
}
