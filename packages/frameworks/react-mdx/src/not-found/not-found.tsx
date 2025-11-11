// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {HTMLAttributes, ReactNode} from "react"

import {ChevronLeftIcon} from "lucide-react"

import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"
import {Link} from "@qualcomm-ui/react/link"
import {clsx} from "@qualcomm-ui/utils/clsx"

export interface NotFoundProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {}

export function NotFound({className, ...props}: NotFoundProps): ReactNode {
  const {renderLink: RenderLink} = useMdxDocsContext()
  return (
    <div className={clsx("qui-docs__not-found", className)} {...props}>
      <h1 className="mdx">Not Found</h1>
      <Link render={<RenderLink href="/" />} startIcon={ChevronLeftIcon}>
        Click here to return home
      </Link>
    </div>
  )
}
