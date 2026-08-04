// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"
import {useMdxDocsLayoutContext} from "@qualcomm-ui/react-mdx/docs-layout"
import {Link} from "@qualcomm-ui/react/link"
import type {QuiInlineTagDisplayPart} from "@qualcomm-ui/typedoc-common"

export interface PropDescriptionLinkProps {
  inlineTag: QuiInlineTagDisplayPart
}

export function PropDescriptionLink({
  inlineTag,
}: PropDescriptionLinkProps): ReactElement {
  const {target, text} = inlineTag
  const {renderLink: RenderLink} = useMdxDocsContext()
  const {toc} = useMdxDocsLayoutContext()

  if (
    text.startsWith("http") ||
    (typeof target === "string" && target.startsWith("http"))
  ) {
    return (
      <Link
        endIcon={ExternalLink}
        href={target as string}
        size="sm"
        target="_blank"
      >
        {text}
      </Link>
    )
  } else if (text.startsWith("/")) {
    return (
      <Link render={<RenderLink href={text} />} size="sm">
        {text}
      </Link>
    )
  }

  const tocItem = toc.find((item) => item.textContent === text)

  return (
    <Link
      render={<RenderLink href={tocItem ? `#${tocItem.id}` : `#${text}`} />}
      size="sm"
    >
      {text}
    </Link>
  )
}
