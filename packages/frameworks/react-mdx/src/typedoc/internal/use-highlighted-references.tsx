// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {HighlightedReference} from "@qualcomm-ui/react-mdx/code-highlight"
import {useDocsPageContext} from "@qualcomm-ui/react-mdx/context"
import type {SerializedRef} from "@qualcomm-ui/typedoc-common"

import {PropDescriptionSummary} from "../prop-description/index.js"

/**
 * The site's refs only change with the site data, so every code block shares
 * one set of hover card entries.
 */
const cache = new WeakMap<
  Record<string, SerializedRef>,
  Record<string, HighlightedReference>
>()

/**
 * The hover card content for the named types that the site's doc props
 * display, by name.
 */
export function useHighlightedReferences():
  | Record<string, HighlightedReference>
  | undefined {
  const {typeRefs} = useDocsPageContext()
  if (!typeRefs) {
    return undefined
  }
  let references = cache.get(typeRefs)
  if (!references) {
    references = Object.fromEntries(
      Object.entries(typeRefs).map(([name, ref]) => [
        name,
        {
          description: ref.summary?.length ? (
            <PropDescriptionSummary summary={ref.summary} />
          ) : undefined,
          prettyType: ref.prettyType,
        },
      ]),
    )
    cache.set(typeRefs, references)
  }
  return references
}
