// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {FileTextIcon} from "lucide-react"

import {isFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import {Icon} from "@qualcomm-ui/react/icon"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {clsx} from "@qualcomm-ui/utils/clsx"

import type {GroupedSearchResult} from "./use-grouped-results"

export type GroupedResultItemProps = ElementRenderProp<"button"> & {
  active: boolean
  item: GroupedSearchResult
}

export function GroupedResultItem({
  active,
  className,
  item,
  ref,
  ...props
}: GroupedResultItemProps): ReactElement {
  return (
    <PolymorphicElement
      ref={ref}
      as="button"
      className={clsx(
        "qui-site-search__list-item qui-menu-item__root",
        className,
      )}
      data-focus-visible={booleanDataAttr(isFocusVisible())}
      data-highlighted={booleanDataAttr(active)}
      {...props}
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
