// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useState} from "react"

import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"

import {MediaContent, type OpenApiContent} from "./media-content.js"

export interface OpenApiResponse {
  content?: OpenApiContent
  description?: string
}

/**
 * One response at a time, picked by status code.
 */
export function Responses({
  responses,
}: {
  responses?: Record<string, OpenApiResponse>
}): ReactNode {
  const codes = Object.keys(responses ?? {})
  const [selected, setSelected] = useState(codes[0])
  if (!codes.length) {
    return null
  }
  const code = codes.includes(selected) ? selected : codes[0]
  const response = responses![code]

  return (
    <section>
      <h2 className="mdx">Responses</h2>
      <SegmentedControl.Root
        onValueChange={(value) => value?.[0] && setSelected(value[0])}
        value={[code]}
      >
        {codes.map((value) => (
          <SegmentedControl.Item key={value} text={value} value={value} />
        ))}
      </SegmentedControl.Root>
      {response.description ? (
        <p className="qui-docs-openapi__description mdx">
          {response.description}
        </p>
      ) : null}
      <MediaContent key={code} content={response.content} />
    </section>
  )
}
