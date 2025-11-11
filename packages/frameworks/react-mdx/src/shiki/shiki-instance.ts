// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import angularHtml from "@shikijs/langs/angular-html"
import angularTs from "@shikijs/langs/angular-ts"
import json from "@shikijs/langs/json"
import shell from "@shikijs/langs/shell"
import tsx from "@shikijs/langs/tsx"
import typescript from "@shikijs/langs/typescript"
import light from "@shikijs/themes/github-light-high-contrast"
import {createHighlighterCore} from "react-shiki/core"
import {createJavaScriptRegexEngine} from "shiki"
import type {HighlighterCore} from "shiki/types"

import {quiCustomDarkTheme} from "@qualcomm-ui/mdx-common"

const jsEngine = createJavaScriptRegexEngine({forgiving: true})

const langs = [tsx, typescript, json, shell, angularTs, angularHtml]
export const supportedLangs: Set<string> = new Set([
  "tsx",
  "typescript",
  "json",
  "shell",
  "angular-ts",
  "angular-html",
])

// Create custom highlighter with dynamic imports to optimize client-side bundle size
export const shikiHighlighter: HighlighterCore = await createHighlighterCore({
  engine: jsEngine,
  langs,
  themes: [
    {
      ...quiCustomDarkTheme,
      name: "dark",
    },
    {...light, name: "light"},
  ],
})

export const dummyTypeName = "___extra_special_dummy_type_that_will_be_stripped"

/**
 * Types are prefixed with this string so that highlighting works as expected for
 * unions and function types.
 */
export const dummyTypePrefix: string = `type ${dummyTypeName}=`
