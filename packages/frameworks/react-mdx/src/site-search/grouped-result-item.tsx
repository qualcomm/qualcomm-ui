// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {FileTextIcon} from "lucide-react"

import {isFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {Icon} from "@qualcomm-ui/react/icon"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import type {GroupedSearchResult} from "./use-grouped-results.js"

export interface GroupedResultItemProps extends ElementRenderProp<"button"> {
  active: boolean
  item: GroupedSearchResult
}

export function GroupedResultItem({
  active,
  item,
  ...props
}: GroupedResultItemProps): ReactElement {
  const mergedProps = mergeProps(
    {
      className: "qui-site-search__list-item qui-menu-item__root",
    },
    props,
  )

  return (
    <PolymorphicElement
      as="button"
      data-focus-visible={booleanDataAttr(isFocusVisible())}
      data-highlighted={booleanDataAttr(active)}
      {...mergedProps}
    >
      <Icon
        className="qui-site-search__item-icon"
        icon={FileTextIcon}
        size="lg"
      />
      <div className="qui-site-search__list-item-content">
        <span className="qui-site-search__content">{item.title}</span>
        <div className="qui-site-search__metadata">{item.categoryId}</div>
      </div>
    </PolymorphicElement>
  )
}
