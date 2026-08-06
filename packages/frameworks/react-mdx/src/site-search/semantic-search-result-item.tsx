import type {ReactElement} from "react"

import {TextSearchIcon} from "lucide-react"

import {isFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import type {SemanticSearchResult} from "@qualcomm-ui/mdx-common"
import {HighlightText} from "@qualcomm-ui/react-core/highlight"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {Icon} from "@qualcomm-ui/react/icon"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MarkdownSearchResultItemProps extends ElementRenderProp<"button"> {
  active: boolean
  item: SemanticSearchResult
  matchedQuery: string
}

/**
 * Search result item for rendering results from QUI Docs MCP hybrid search.
 */
export function SemanticSearchResultItem({
  active,
  item,
  matchedQuery,
  ...props
}: MarkdownSearchResultItemProps): ReactElement {
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
        icon={TextSearchIcon}
        size="lg"
      />
      <div className="qui-site-search__list-item-content">
        <>
          <span className="qui-site-search__content">
            <HighlightText
              ignoreCase
              matchAll
              query={matchedQuery}
              text={item.content}
            />
          </span>
          <div className="qui-site-search__metadata">
            {item.headerPath.map((heading) => (
              <span key={heading}>{heading}</span>
            ))}
          </div>
        </>
      </div>
    </PolymorphicElement>
  )
}
