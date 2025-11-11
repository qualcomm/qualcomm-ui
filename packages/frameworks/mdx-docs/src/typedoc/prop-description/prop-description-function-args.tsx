import type {ReactNode} from "react"

import type {
  QuiCommentDisplayPart,
  SerializedParameters,
} from "@qualcomm-ui/mdx-docs-common"

import {PropDescriptionSummary} from "./prop-description-summary"

interface Props {
  functionArgs: SerializedParameters[]
}

export function PropDescriptionFunctionArgs({functionArgs}: Props): ReactNode {
  const filteredArgs = functionArgs.filter(
    (arg) => arg.name && arg.summary?.length,
  ) as Array<SerializedParameters & {summary: QuiCommentDisplayPart[]}>
  return (
    <ul className="doc-props__function-args-list">
      {filteredArgs.map((arg) => {
        return (
          <li key={arg.name} className="doc-props__function-args-list-item">
            <span>
              <span className="doc-props__function-arg-name">{arg.name}</span>

              <span>
                <PropDescriptionSummary summary={arg.summary} />
              </span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
