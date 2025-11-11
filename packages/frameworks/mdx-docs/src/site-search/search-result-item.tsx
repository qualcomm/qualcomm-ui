// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useRef} from "react"

import {HashIcon, TablePropertiesIcon, TextSearchIcon} from "lucide-react"

import {isFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import type {SearchResult} from "@qualcomm-ui/mdx-docs-common"
import {Icon} from "@qualcomm-ui/react/icon"
import {HighlightText} from "@qualcomm-ui/react-core/highlight"
import {useMergedRef} from "@qualcomm-ui/react-core/refs"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {clsx} from "@qualcomm-ui/utils/clsx"

export type SearchResultItemProps = ElementRenderProp<"button"> & {
  active: boolean
  inputValue: string
  isChild?: boolean
  item: SearchResult
}

function getSearchResultIcon(item: SearchResult) {
  if (item.isDocProp) {
    return TablePropertiesIcon
  }
  if (item.type === "content") {
    return TextSearchIcon
  }
  return HashIcon
}

export function SearchResultItem({
  active,
  className,
  inputValue,
  isChild = false,
  item,
  ref,
  ...props
}: SearchResultItemProps): ReactElement {
  const rootRef = useRef<HTMLButtonElement>(null)
  const mergedRef = useMergedRef(ref, rootRef)
  const icon = getSearchResultIcon(item)

  return (
    <PolymorphicElement
      ref={mergedRef}
      as="button"
      className={clsx(
        "qui-site-search__list-item",
        "qui-menu-item__root",
        className,
      )}
      data-child={booleanDataAttr(isChild)}
      data-focus-visible={booleanDataAttr(isFocusVisible())}
      data-highlighted={booleanDataAttr(active)}
      data-type={item.type}
      {...props}
    >
      {icon ? (
        <Icon className="qui-site-search__item-icon" icon={icon} size="lg" />
      ) : null}
      <div className="qui-site-search__list-item-content">
        {item.type === "content" && item.content ? (
          <>
            <span className="qui-site-search__content">
              <HighlightText
                ignoreCase
                matchAll
                query={inputValue.split(" ").at(-1) ?? ""}
                text={item.content.map((content) => content.content).join("")}
              />
            </span>
            <div className="qui-site-search__metadata">{item.heading}</div>
          </>
        ) : (
          <>
            <span className="qui-site-search__content">{item.heading}</span>
            {item.title && (
              <div className="qui-site-search__metadata">{item.title}</div>
            )}
          </>
        )}
      </div>
    </PolymorphicElement>
  )
}
