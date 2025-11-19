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
        <Link
          endIcon={ExternalLink}
          href={target as string}
          size="md"
          target="_blank"
        >
          {text}
        </Link>
      ) : text.startsWith("/") ? (
        <Link render={<RenderLink href={text} />} size="md">
          {text}
        </Link>
      ) : (
        <Link render={<RenderLink href={`#${text}`} />} size="md">
          {text}
        </Link>
      ),
  }

  if (tag && tags[tag]) {
    return tags[tag]()
  }

  return <></>
}
