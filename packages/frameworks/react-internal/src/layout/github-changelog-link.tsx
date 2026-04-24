// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {Link} from "@qualcomm-ui/react/link"

export interface GithubChangelogLinkProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  href: string
}

export function GithubChangelogLink(
  props: GithubChangelogLinkProps,
): ReactElement {
  return (
    <Link
      className="mb-[-2px] hidden md:inline-flex"
      emphasis="neutral"
      render={<a href={props.href} rel="noreferrer" target="_blank" />}
      size="xs"
    >
      {props.children}
    </Link>
  )
}
