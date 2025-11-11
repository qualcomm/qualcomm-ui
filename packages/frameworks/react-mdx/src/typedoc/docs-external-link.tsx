// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {ExternalLink} from "lucide-react"

import {Link} from "@qualcomm-ui/react/link"

interface Props {
  as?: "pre" | "code"
  href: string
  text: string
}

export function DocsExternalLink({
  as: Element = "pre",
  href,
  text,
}: Props): ReactNode {
  return (
    <Element className="qui-docs-code font-code-demo fit">
      <Link endIcon={ExternalLink} href={href} target="_blank">
        {text}
      </Link>
    </Element>
  )
}
