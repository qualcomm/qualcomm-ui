// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {ChevronLeft, ChevronRight} from "lucide-react"

import {
  type MdxDocsContextValue,
  useMdxDocsContext,
} from "@qualcomm-ui/react-mdx/context"
import type {NavItem} from "@qualcomm-ui/mdx-common"
import {Link} from "@qualcomm-ui/react/link"
import {
  bindingRenderProp,
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {clsx} from "@qualcomm-ui/utils/clsx"
import {TreeCollection} from "@qualcomm-ui/utils/collection"

import {useMdxDocsLayoutContext} from "./use-mdx-docs-layout"

interface PageLinkProp {
  pageLink: NavItem
  prev?: boolean
  renderLink: MdxDocsContextValue["renderLink"]
}

function PageLink({
  pageLink,
  prev,
  renderLink: RenderLink,
}: PageLinkProp): ReactNode {
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
        </span>
      </>
    ),
    className: clsx("qui-page-link__root", {"q-next": !prev}),
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
): [NavItem | false, NavItem | false] {
  const index = items.findIndex((item) => item.id === route)
  if (index === -1) {
    return [false, false]
  }
  const prevPage = items[index - 1]
  const nextPage = items[index + 1]
  return [prevPage ?? false, nextPage ?? false]
}
