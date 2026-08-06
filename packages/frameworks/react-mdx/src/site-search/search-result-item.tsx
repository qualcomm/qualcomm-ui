// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {HashIcon, TablePropertiesIcon, TextSearchIcon} from "lucide-react"

import {isFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import type {SearchResult} from "@qualcomm-ui/mdx-common"
import {HighlightText} from "@qualcomm-ui/react-core/highlight"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {Icon} from "@qualcomm-ui/react/icon"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface SearchResultItemProps extends ElementRenderProp<"button"> {
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
  inputValue,
  isChild = false,
  item,
  ...props
}: SearchResultItemProps): ReactElement {
  const icon = getSearchResultIcon(item)
  const mergedProps = mergeProps(
    {
      className: "qui-site-search__list-item qui-menu-item__root",
    },
    props,
  )

  return (
    <PolymorphicElement
      as="button"
      data-child={booleanDataAttr(isChild)}
      data-focus-visible={booleanDataAttr(isFocusVisible())}
      data-highlighted={booleanDataAttr(active)}
      data-type={item.type}
      {...mergedProps}
    >
      <Icon className="qui-site-search__item-icon" icon={icon} size="lg" />
      <div className="qui-site-search__list-item-content">
        {item.type === "content" && item.content ? (
          <>
            <span className="qui-site-search__content">
              <HighlightText
                ignoreCase
                matchAll
                query={
                  inputValue.length > 1
                    ? (inputValue.split(" ").at(-1) ?? "")
                    : ""
                }
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
