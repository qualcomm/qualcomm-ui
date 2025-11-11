// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {ExternalLink} from "lucide-react"

import {Link} from "@qualcomm-ui/react/link"
import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"
import type {QuiInlineTagDisplayPart} from "@qualcomm-ui/typedoc-common"

interface Props {
  inlineTag: QuiInlineTagDisplayPart
}

export function PropDescriptionInlineTag({
  inlineTag: {tag, target, text},
}: Props): ReactNode {
  const {renderLink: RenderLink} = useMdxDocsContext()
  const tags: Record<string, () => ReactNode> = {
    "@link": () =>
      text.startsWith("http") ||
      (typeof target === "string" && target.startsWith("http")) ? (
        <Link endIcon={ExternalLink} href={target as string} target="_blank">
          {text}
        </Link>
      ) : text.startsWith("/") ? (
        <RenderLink href={text}>{text}</RenderLink>
      ) : (
        <RenderLink href={`#${text}`}>{text}</RenderLink>
      ),
  }

  if (tag && tags[tag]) {
    return tags[tag]()
  }

  return <></>
}
