// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Fragment, type ReactNode} from "react"

import {Link} from "react-router"

import type {NavBadge} from "@qualcomm-ui/mdx-common"
import {Badge, type BadgeProps} from "@qualcomm-ui/react/badge"
import {defined} from "@qualcomm-ui/utils/guard"

const navBadges: Record<string, BadgeProps> = {
  alpha: {
    emphasis: "orange",
  },
  beta: {
    emphasis: "purple",
  },
}

const headerBadges: Record<string, BadgeProps> = {
  alpha: {
    emphasis: "orange",
  },
  beta: {
    emphasis: "purple",
  },
  since: {
    emphasis: "brand",
  },
}

export function SideNavBadges({badges}: {badges: NavBadge[]}): ReactNode {
  return (
    <>
      {badges
        .filter((badge) => {
          if (!navBadges[badge.id]) {
            return false
          }
          if (defined(badge.sideNavLabel) && !badge.sideNavLabel) {
            return false
          }
          return true
        })
        .map((badge) => {
          const props = navBadges[badge.id]
          return (
            <Fragment key={badge.id}>
              <Badge size="sm" {...props}>
                {badge.sideNavLabel || badge.label}
              </Badge>
            </Fragment>
          )
        })}
    </>
  )
}

export function PageHeaderBadges({badges}: {badges: NavBadge[]}): ReactNode {
  return (
    <>
      {badges
        .filter((badge) => {
          return headerBadges[badge.id]
        })
        .map((badge) => {
          const props = headerBadges[badge.id]
          let pathname: string = ""
          let href: string = ""

          if (badge.url) {
            if (badge.url.startsWith("/")) {
              pathname = badge.url
            } else if (badge.url.startsWith("http")) {
              href = badge.url
            }
          }

          return (
            <Fragment key={badge.id}>
              <Badge
                render={
                  pathname ? (
                    <Link to={pathname} />
                  ) : href ? (
                    <a href={href} rel="noreferrer" target="_blank" />
                  ) : (
                    <div />
                  )
                }
                size="sm"
                style={{height: 20, marginTop: 8}}
                {...props}
              >
                {badge.label}
              </Badge>
            </Fragment>
          )
        })}
    </>
  )
}
