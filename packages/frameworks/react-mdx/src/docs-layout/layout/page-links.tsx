// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import type {NavItem} from "@qualcomm-ui/mdx-common"
import {
  bindingRenderProp,
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {
  type DocsRuntimeContextValue,
  useDocsRuntimeContext,
  useDocsPageContext,
} from "@qualcomm-ui/react-mdx/context"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {clsx} from "@qualcomm-ui/utils/clsx"
import {TreeCollection} from "@qualcomm-ui/utils/collection"

interface PageLinkProp {
  pageLink: NavItem
  prev?: boolean
  renderLink: DocsRuntimeContextValue["renderLink"]
}

function PageLink({
  pageLink,
  prev,
  renderLink: RenderLink,
}: PageLinkProp): ReactNode {
  return bindingRenderProp(<RenderLink href={pageLink.pathname!} />, {
    children: (
      <>
        <div
          className="qui-page-link__next-prev-label"
          data-next={booleanDataAttr(!prev)}
        >
          {prev ? "Previous" : "Next"}
        </div>
        <div className="qui-page-link__title">{pageLink.title}</div>
      </>
    ),
    className: "qui-page-link__root",
    "data-next": booleanDataAttr(!prev),
  })
}

export interface PageLinksProps extends ElementRenderProp<"div"> {}

export function PageLinks({className, ...props}: PageLinksProps): ReactElement {
  const {renderLink} = useDocsRuntimeContext()
  const {navItems, pathname} = useDocsPageContext()

  const flattenedItems = useMemo(
    () =>
      new TreeCollection<NavItem>({
        nodeChildren: "items",
        nodeText: "title",
        nodeValue: "id",
        rootNode: {
          depth: 0,
          id: "ROOT",
          items: navItems,
          pathSegments: [],
          title: "",
        },
      })
        .flatten()
        .filter((item) => item.pathname),
    [navItems],
  )
  const [prevPage, nextPage] = useMemo(
    () => getPageLinks(flattenedItems, pathname),
    [flattenedItems, pathname],
  )

  return (
    <PolymorphicElement
      as="div"
      className={clsx("qui-page-links__container", className)}
      {...props}
    >
      <div className="qui-page-links__link-wrapper">
        {prevPage ? (
          <PageLink pageLink={prevPage} prev renderLink={renderLink} />
        ) : null}
      </div>
      <div className="qui-page-links__link-wrapper">
        {nextPage ? (
          <PageLink pageLink={nextPage} renderLink={renderLink} />
        ) : null}
      </div>
    </PolymorphicElement>
  )
}

export function getPageLinks(
  items: NavItem[],
  route: string,
): [NavItem | false, NavItem | false, NavItem | false] {
  const index = items.findIndex((item) => item.id === route)
  if (index === -1) {
    return [false, false, false]
  }
  const prevPage = items[index - 1]
  const nextPage = items[index + 1]
  return [prevPage ?? false, nextPage ?? false, items[index]]
}
