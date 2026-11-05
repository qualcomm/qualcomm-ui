// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useRef} from "react"

import {TextSearchIcon} from "lucide-react"

import {isFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import type {
  SemanticSearchHighlight,
  SemanticSearchResult,
} from "@qualcomm-ui/mdx-common"
import {useMergedRef} from "@qualcomm-ui/react-core/refs"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {Icon} from "@qualcomm-ui/react/icon"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {clsx} from "@qualcomm-ui/utils/clsx"

export type SemanticSearchResultItemProps = ElementRenderProp<"button"> & {
  active: boolean
  item: SemanticSearchResult
}

export function SemanticSearchResultItem({
  active,
  className,
  item,
  ref,
  ...props
}: SemanticSearchResultItemProps): ReactElement {
  const rootRef = useRef<HTMLButtonElement>(null)
  const mergedRef = useMergedRef(ref, rootRef)

  return (
    <PolymorphicElement
      ref={mergedRef}
      as="button"
      className={clsx(
        "qui-site-search__list-item",
        "qui-menu-item__root",
        className,
      )}
      data-focus-visible={booleanDataAttr(isFocusVisible())}
      data-highlighted={booleanDataAttr(active)}
      {...props}
    >
      <Icon
        className="qui-site-search__item-icon"
        icon={TextSearchIcon}
        size="lg"
      />
      <div className="qui-site-search__list-item-content">
        <span className="qui-site-search__section-title">{item.heading}</span>
        <div className="qui-site-search__metadata">{item.title}</div>
        <span className="qui-site-search__content">
          <HighlightedExcerpt
            excerpt={item.excerpt}
            highlights={item.highlights}
          />
        </span>
      </div>
    </PolymorphicElement>
  )
}

function HighlightedExcerpt({
  excerpt,
  highlights,
}: {
  excerpt: string
  highlights: SemanticSearchHighlight[] | undefined
}): ReactNode {
  const validHighlights = (highlights ?? [])
    .filter(
      (highlight) =>
        Number.isInteger(highlight.start) &&
        Number.isInteger(highlight.end) &&
        highlight.start >= 0 &&
        highlight.end - highlight.start > 2 &&
        highlight.end <= excerpt.length,
    )
    .sort((left, right) => left.start - right.start)
    .filter(
      (highlight, index, sortedHighlights) =>
        index === 0 || highlight.start >= sortedHighlights[index - 1].end,
    )

  if (validHighlights.length === 0) {
    return excerpt
  }

  const nodes: ReactNode[] = []
  let offset = 0

  for (const highlight of validHighlights) {
    if (offset < highlight.start) {
      nodes.push(excerpt.slice(offset, highlight.start))
    }
    nodes.push(
      <mark key={`${highlight.start}-${highlight.end}`}>
        {excerpt.slice(highlight.start, highlight.end)}
      </mark>,
    )
    offset = highlight.end
  }

  if (offset < excerpt.length) {
    nodes.push(excerpt.slice(offset))
  }

  return nodes
}
