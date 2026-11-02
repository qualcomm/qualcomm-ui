// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useMemo, useState} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {Select} from "@qualcomm-ui/react/select"

import {type CodeSampleInput, getCodeSamples} from "./code-samples.js"

export function CodeSamplesPanel({
  operation,
}: {
  operation: CodeSampleInput
}): ReactNode {
  const samples = useMemo(() => getCodeSamples(operation), [operation])
  const collection = useMemo(
    () =>
      selectCollection({
        items: samples.map(({label}) => ({label, value: label})),
      }),
    [samples],
  )
  const [value, setValue] = useState([samples[0].label])
  const sample = samples.find(({label}) => label === value[0]) ?? samples[0]

  return (
    <aside className="qui-docs-openapi__samples">
      <div className="qui-docs-openapi__samples-header">
        <span>Example request</span>
        <Select
          clearable={false}
          collection={collection}
          controlProps={{"aria-label": "Language"}}
          onValueChange={(next) => next.length && setValue(next)}
          size="sm"
          value={value}
        />
      </div>
      <CodeHighlight
        className="mdx"
        code={sample.code}
        language={sample.language}
        preProps={{className: "qui-docs__mdx-scrollbar"}}
      />
    </aside>
  )
}
