// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Link} from "@qualcomm-ui/react/link"

export interface GithubChangelogLinkProps {
  href: string
}

export function GithubChangelogLink(
  props: GithubChangelogLinkProps,
): ReactElement {
  return (
    <Link
      className="hidden md:inline-flex"
      emphasis="neutral"
      render={<a href={props.href} rel="noreferrer" target="_blank" />}
      size="xs"
    >
      NEXTGEN
    </Link>
  )
}
