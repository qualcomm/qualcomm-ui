// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Fragment, type ReactNode} from "react"

import {compiler} from "markdown-to-jsx"

import {CodeHighlight} from "@qualcomm-ui/mdx-docs/code-highlight"
import type {QuiCommentDisplayPart} from "@qualcomm-ui/typedoc-common"

import {PropDescriptionInlineTag} from "./prop-description-inline-tag"

interface Props {
  summary: QuiCommentDisplayPart[]
}

export function PropDescriptionSummary({summary}: Props): ReactNode {
  return (
    <>
      {summary.map((part, index) => {
        let language: string = "tsx"
        if (part.kind === "code" && part.text.startsWith("```")) {
          language = part.text.substring(3, part.text.indexOf("\n"))
        }
        return (
          <Fragment key={index}>
            {part.kind === "code" ? (
              <Fragment key={index}>
                {part.text.startsWith("```") ? (
                  <CodeHighlight
                    className="doc-props-description__summary-code"
                    // TODO: extract language, move to typedoc utils.
                    code={part.text
                      .replace(/```.*\r\n/, "")
                      .replace(/\r\n```/, "")
                      .replace(/```.*\n/, "")
                      .replace(/\n```/, "")}
                    disableCopy
                    language={language}
                  />
                ) : (
                  <span>{compiler(part.text)}</span>
                )}
              </Fragment>
            ) : part.kind === "inline-tag" ? (
              <PropDescriptionInlineTag key={index} inlineTag={part} />
            ) : part.text === "\n" ? (
              <br />
            ) : (
              <span
                dangerouslySetInnerHTML={{
                  __html: part.text
                    .replaceAll("\n\n", "<br /><br />")
                    .replaceAll("\n-", "<br />-"),
                }}
              />
            )}
          </Fragment>
        )
      })}
    </>
  )
}
