import type {ReactNode} from "react"

import {ExternalLink} from "lucide-react"

import {useMdxDocsContext} from "@qualcomm-ui/mdx-docs/context"
import type {QuiInlineTagDisplayPart} from "@qualcomm-ui/mdx-docs-common"
import {Link} from "@qualcomm-ui/react/link"

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
