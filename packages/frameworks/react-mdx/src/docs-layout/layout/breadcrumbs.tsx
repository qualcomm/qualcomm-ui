// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useMemo} from "react"

import {
  Breadcrumbs,
  type BreadcrumbsItemProps,
} from "@qualcomm-ui/react/breadcrumbs"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"
import {clsx} from "@qualcomm-ui/utils/clsx"

import {useMdxDocsLayoutContext} from "./use-mdx-docs-layout"

export interface BreadcrumbsProps extends ElementRenderProp<"div"> {
  /**
   * Optional override for the base path breadcrumb item.
   */
  rootBreadcrumb?: BreadcrumbsItemProps
}

interface DocsBreadcrumb extends BreadcrumbsItemProps {
  id: string
}

export function DocsBreadcrumbs({
  className,
  rootBreadcrumb,
  ...props
}: BreadcrumbsProps): ReactNode {
  const {renderLink: Link} = useMdxDocsContext()
  const {pageMap, pathname} = useMdxDocsLayoutContext()

  const items: DocsBreadcrumb[] = useMemo(() => {
    const pageMapEntry = pageMap[pathname]

    if (!pageMapEntry || pageMapEntry.hideBreadcrumbs) {
      return []
    }

    // concat the paths as we iterate over the path segments.
    let mergedPath: string = ""

    const crumbs = pageMapEntry.pathSegments.reduce(
      (acc: DocsBreadcrumb[], segment, currentIndex) => {
        // concat the paths as we iterate over the path segments.
        mergedPath = `${mergedPath}/${segment}`
        const route = pageMap[mergedPath]
        const pageTitle = pageMapEntry.categories[currentIndex] ?? route.title

        acc.push({
          children: pageTitle,
          id: route?.pathname ?? route?.id ?? pageTitle,
          render: route?.pathname ? (
            <Link href={route.pathname} />
          ) : (
            <button style={{pointerEvents: "none"}} />
          ),
        })

        return acc
      },
      [],
    )

    return rootBreadcrumb ? [{...rootBreadcrumb, id: "/"}, ...crumbs] : crumbs
  }, [Link, pageMap, pathname, rootBreadcrumb])

  // don't render if there aren't any items
  if (!items.length) {
    return null
  }

  return (
    <PolymorphicElement
      className={clsx("qui-docs__breadcrumbs", className)}
      {...props}
    >
      <Breadcrumbs.Root emphasis="neutral">
        <Breadcrumbs.List>
          {items.map((item) => (
            <Breadcrumbs.Item key={item.id} {...item} />
          ))}
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
    </PolymorphicElement>
  )
}
