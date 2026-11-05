// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {HTMLAttributes, ReactNode} from "react"

import {useDocsRuntimeContext} from "@qualcomm-ui/react-mdx/context"
import {Link} from "@qualcomm-ui/react/link"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface NotFoundProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  url?: string | null
}

export function NotFound({url, ...props}: NotFoundProps): ReactNode {
  const {renderLink: RenderLink} = useDocsRuntimeContext()
  const mergedProps = mergeProps({className: "qui-docs__not-found"}, props)
  return (
    <div {...mergedProps}>
      <div className="qui-docs__page-intro">
        <div className="qui-docs__page-header">
          <h1 className="mdx">Not Found</h1>
        </div>
        {url ? (
          <p className="qui-docs__not-found-url mdx">
            The page at <code className="mdx">{url}</code> does not exist.
          </p>
        ) : null}
      </div>
      <Link render={<RenderLink href="/" />} size="lg">
        Click here to return home
      </Link>
    </div>
  )
}
