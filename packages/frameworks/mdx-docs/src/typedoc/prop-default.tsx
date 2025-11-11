import type {ReactElement} from "react"

import {compiler} from "markdown-to-jsx"

import type {QuiComment, QuiPropDeclaration} from "@qualcomm-ui/mdx-docs-common"

export interface PropDefaultProps {
  prop: QuiPropDeclaration
}

function sanitize(text: string): string {
  return text.replaceAll("&lt;", "<").replaceAll("&gt;", ">")
}

export function PropDefault({prop}: PropDefaultProps): ReactElement | null {
  const comment: QuiComment = prop.comment ?? {summary: []}

  const defaultValue = (comment.blockTags ?? []).find(
    (tag) => tag.tag === "@default",
  )

  const jsx = defaultValue
    ? compiler(sanitize(defaultValue.content[0].text), {
        overrides: {
          code: {
            component: "pre",
            props: {
              className: "qui-docs-code font-code-demo fit",
            },
          },
          pre: {
            component: "span",
          },
        },
      })
    : null
  return <span>{jsx}</span>
}
