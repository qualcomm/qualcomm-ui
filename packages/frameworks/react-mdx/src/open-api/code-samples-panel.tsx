// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useMemo, useState} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {Select} from "@qualcomm-ui/react/select"

import {type CodeSampleInput, getCodeSamples} from "./code-samples.js"
import {isJsonMediaType} from "./get-example.js"
import {getResponseExamples} from "./response-examples.js"

interface ExampleOption {
  /**
   * `null` when there is nothing to show, e.g. a response without a body.
   */
  code: string | null
  label: string
  language: string
}

function ExampleBlock({
  options,
  pickerLabel,
  title,
}: {
  options: ExampleOption[]
  pickerLabel: string
  title: string
}): ReactNode {
  const collection = useMemo(
    () =>
      selectCollection({
        items: options.map(({label}) => ({label, value: label})),
      }),
    [options],
  )
  const [value, setValue] = useState([options[0]?.label ?? ""])
  const option = options.find(({label}) => label === value[0]) ?? options[0]
  if (!option) {
    return null
  }

  return (
    <div className="qui-docs-openapi__example">
      <div className="qui-docs-openapi__samples-header">
        <span>{title}</span>
        <Select
          clearable={false}
          collection={collection}
          controlProps={{"aria-label": pickerLabel}}
          onValueChange={(next) => next.length && setValue(next)}
          size="sm"
          value={[option.label]}
        />
      </div>
      {option.code === null ? (
        <p className="mdx">No content</p>
      ) : (
        <CodeHighlight
          className="mdx"
          code={option.code}
          language={option.language}
          preProps={{className: "qui-docs__mdx-scrollbar"}}
        />
      )}
    </div>
  )
}

export function CodeSamplesPanel({
  operation,
}: {
  operation: CodeSampleInput
}): ReactNode {
  const requests = useMemo(() => getCodeSamples(operation), [operation])
  const responses = useMemo(
    () =>
      getResponseExamples(operation.responses).map(
        ({code, example, mediaType}): ExampleOption => ({
          code:
            example === undefined
              ? null
              : typeof example === "string" && !isJsonMediaType(mediaType)
                ? example
                : JSON.stringify(example, null, 2),
          label: code,
          language: isJsonMediaType(mediaType) ? "json" : "text",
        }),
      ),
    [operation],
  )

  return (
    <aside className="qui-docs-openapi__samples">
      <ExampleBlock
        options={requests}
        pickerLabel="Language"
        title="Example request"
      />
      <ExampleBlock
        options={responses}
        pickerLabel="Status code"
        title="Example response"
      />
    </aside>
  )
}
