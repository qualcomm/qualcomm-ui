// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Fragment, type ReactNode} from "react"

import {useMdxDocsContext} from "@qualcomm-ui/mdx-docs/context"
import {Link} from "@qualcomm-ui/react/link"
import type {
  QuiCommentDisplayPart,
  QuiCommentTag,
} from "@qualcomm-ui/typedoc-common"

import {PropDescriptionSummary} from "./prop-description-summary"

function isSingleLinkTag(tag: QuiCommentTag) {
  return (
    tag.content.length === 1 &&
    (tag.content[0].docLink ||
      (tag.content[0].kind === "text" && !tag.content[0].text.includes(" ")))
  )
}

function isMultiLinkTag(tag: QuiCommentTag) {
  const chunkSize = 3
  if (tag.content.length % 3 !== 0 || tag.content.length < 3) {
    return false
  }
  for (let i = 0; i < tag.content.length; i += chunkSize) {
    const chunk = tag.content.slice(i, i + chunkSize)
    // do whatever
    if (chunk[0].text !== " - ") {
      return false
    }
    if (chunk[2].text !== "\n") {
      return false
    }
  }

  return true
}

function formatSingleLink(content: QuiCommentDisplayPart) {
  if (content.docLink) {
    return {
      text: content.text,
      url: content.docLink,
    }
  }
  return {
    text: content.text,
    url: `./#${content.text}`,
  }
}

interface Props {
  hideTitle?: boolean
  seeTags: QuiCommentTag[]
}

export function PropDescriptionSeeTags({hideTitle, seeTags}: Props): ReactNode {
  const {renderLink: RenderLink} = useMdxDocsContext()
  return (
    <div className="doc-props-description__see-tags">
      {hideTitle ? null : <div>Related symbols:</div>}
      <ul className="see-tag-list">
        {seeTags.map((tag, index) => {
          if (isSingleLinkTag(tag)) {
            const {text, url} = formatSingleLink(tag.content[0])
            return (
              <li key={index}>
                <Link render={<RenderLink href={url} />}>{text}</Link>
              </li>
            )
          }
          if (isMultiLinkTag(tag)) {
            return (
              <Fragment key={index}>
                {tag.content
                  .filter(
                    (content) =>
                      content.text !== " - " && content.text !== "\n",
                  )
                  .map((content) => {
                    const {text, url} = formatSingleLink(content)
                    return (
                      <li key={content.text}>
                        <Link render={<RenderLink href={url} />}>{text}</Link>
                      </li>
                    )
                  })}
              </Fragment>
            )
          }
          return (
            <li key={index}>
              <PropDescriptionSummary summary={tag.content} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
