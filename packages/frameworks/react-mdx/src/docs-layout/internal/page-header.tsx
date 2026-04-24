// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"
import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useMdxDocsLayoutContext} from "../layout"

import {resolveFrontmatterBadges} from "./page-header-utils"

export interface PageHeaderProps extends ComponentPropsWithRef<"h1"> {}

export function PageHeader(props: PageHeaderProps): ReactElement {
  const context = useMdxDocsLayoutContext()
  const {renderLink: RenderLink} = useMdxDocsContext()
  const frontmatter = context.pageFrontmatter

  const badges = resolveFrontmatterBadges(frontmatter)

  return (
    <div className="qui-docs__page-header">
      <h1 {...mergeProps({className: "mdx"}, props)} />
      {badges.map((badge) => (
        <Badge
          key={badge.label}
          className="qui-docs__page-header-badge"
          emphasis={badge.emphasis}
          render={
            badge.pathname ? (
              <RenderLink href={badge.pathname} />
            ) : badge.href ? (
              <a href={badge.href} rel="noreferrer" target="_blank" />
            ) : (
              <div />
            )
          }
          size="sm"
          title={badge.title}
        >
          {badge.label}
        </Badge>
      ))}
    </div>
  )
}
