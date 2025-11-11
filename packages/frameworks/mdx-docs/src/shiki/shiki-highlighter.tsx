// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import QuickLru from "quick-lru"
import type {ShikiTransformer} from "shiki"
import type {CodeToHastOptions} from "shiki/types"

import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {dummyTypeName, shikiHighlighter, supportedLangs} from "./shiki-instance"

export interface ShikiHighlighterProps extends ElementRenderProp<"pre"> {
  cache?: boolean
  code: string
  langAlias?: Record<string, string>
  language?: string
  shikiConfig?: Omit<CodeToHastOptions, "themes" | "defaultColor" | "lang">
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
  ...props
}: ShikiHighlighterProps): ReactElement {
  const highlighted = useMemo(() => {
    const language = langAlias?.[languageProp ?? ""] ?? languageProp

    const resolvedConfig: CodeToHastOptions = {
      ...shikiConfig,
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
      ? `${code}-${JSON.stringify(resolvedConfig)}`
      : ""
    if (shouldCache) {
      const cached = shikiCache.get(cacheKey)
      if (cached) {
        return cached
      }
    }

    const result = shikiHighlighter.codeToHtml(code, {
      ...resolvedConfig,
      transformers,
    })

    if (shouldCache) {
      shikiCache.set(cacheKey, result)
    }
    return result
  }, [cache, code, langAlias, languageProp, shikiConfig])

  const mergedProps = mergeProps({className: "shiki-code"}, props)

  return (
    <pre {...mergedProps}>
      <div dangerouslySetInnerHTML={{__html: highlighted}}></div>
    </pre>
  )
}
