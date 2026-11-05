// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import {
  useDocsPageContext,
  useDocsRuntimeContext,
} from "@qualcomm-ui/react-mdx/context"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import type {FrontmatterBadge} from "../types.js"

export interface PageHeaderProps extends ComponentPropsWithRef<"h1"> {}

export function PageHeader(props: PageHeaderProps): ReactElement {
  const context = useDocsPageContext()
  const {layoutComponents} = useDocsRuntimeContext()
  const frontmatter = context.pageFrontmatter

  const badges = (frontmatter.badges ?? []) as FrontmatterBadge[]
  const BadgeComponent = layoutComponents?.PageHeaderBadges

  return (
    <header className="qui-docs__page-header">
      <h1 {...mergeProps({className: "mdx"}, props)} />
      {BadgeComponent && badges.length ? (
        <BadgeComponent badges={badges} />
      ) : null}
    </header>
  )
}
