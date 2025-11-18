// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {capitalCase} from "change-case"
import {ChevronLeft, ChevronRight} from "lucide-react"

import type {NavItem} from "@qualcomm-ui/mdx-common"
import {Link} from "@qualcomm-ui/react/link"
import {
  bindingRenderProp,
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {
  type MdxDocsContextValue,
  useMdxDocsContext,
} from "@qualcomm-ui/react-mdx/context"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {clsx} from "@qualcomm-ui/utils/clsx"
import {TreeCollection} from "@qualcomm-ui/utils/collection"

import {useMdxDocsLayoutContext} from "./use-mdx-docs-layout"

interface PageLinkProp {
  currentPage?: NavItem | false
  pageLink: NavItem
  prev?: boolean
  renderLink: MdxDocsContextValue["renderLink"]
}

function PageLink({
  currentPage,
  pageLink,
  prev,
  renderLink: RenderLink,
}: PageLinkProp): ReactNode {
  const pathSegments = currentPage ? currentPage.pathSegments : []
  const nextPathSegments = pageLink.pathSegments
  const pathSegment =
    nextPathSegments[0] !== pathSegments[0]
      ? capitalCase(nextPathSegments[0])
      : ""

  return bindingRenderProp(<RenderLink href={pageLink.pathname!} />, {
    children: (
      <>
        <span className="qui-page-link__container">
          {prev ? (
            <Link render={<div />} startIcon={ChevronLeft}>
              {pageLink.title}
            </Link>
          ) : (
            <Link endIcon={ChevronRight} render={<div />}>
              {pageLink.title}
            </Link>
          )}

          {pathSegment && pathSegment !== pageLink.title ? (
            <div
              className="qui-page-link__adjacent-route-title"
              data-next={booleanDataAttr(!prev)}
            >
              {pathSegment}
            </div>
          ) : null}
        </span>
      </>
    ),
    className: "qui-page-link__root",
    "data-next": booleanDataAttr(!prev),
  })
}

export interface PageLinksProps extends ElementRenderProp<"div"> {}

export function PageLinks({className, ...props}: PageLinksProps): ReactElement {
  const {renderLink} = useMdxDocsContext()
  const {navItems, pathname} = useMdxDocsLayoutContext()

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
  const [prevPage, nextPage, currentPage] = useMemo(
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
          <PageLink
            currentPage={currentPage}
            pageLink={prevPage}
            prev
            renderLink={renderLink}
          />
        ) : null}
      </div>
      <div className="qui-page-links__link-wrapper">
        {nextPage ? (
          <PageLink
            currentPage={currentPage}
            pageLink={nextPage}
            renderLink={renderLink}
          />
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
