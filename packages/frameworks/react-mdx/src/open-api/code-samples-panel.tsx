// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useMemo} from "react"

import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {CopyToClipboardIconButton} from "@qualcomm-ui/react-mdx/copy-to-clipboard"
import {HttpMethod} from "@qualcomm-ui/react-mdx/docs-layout"

import {type CodeSampleInput, getCodeSamples} from "./code-samples.js"
import {isJsonMediaType} from "./get-example.js"
import {OptionPicker, usePickedOption} from "./option-picker.js"
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
  remember,
  subheader,
  title,
}: {
  options: ExampleOption[]
  pickerLabel: string
  remember?: boolean
  subheader?: ReactNode
  title: string
}): ReactNode {
  const labels = useMemo(() => options.map(({label}) => label), [options])
  const picked = usePickedOption(labels, {remember})
  const option = options[picked.index]
  if (!option) {
    return null
  }

  return (
    <div className="qui-docs-openapi__example">
      <div className="qui-docs-openapi__example-header">
        <span className="qui-docs-openapi__example-title">{title}</span>
        <OptionPicker
          aria-label={pickerLabel}
          labels={labels}
          picked={picked}
        />
        {option.code === null ? null : (
          <CopyToClipboardIconButton
            emphasis="neutral"
            valueOrFn={option.code}
          />
        )}
      </div>
      {subheader ? (
        <div className="qui-docs-openapi__example-subheader">{subheader}</div>
      ) : null}
      {option.code === null ? (
        <p className="qui-docs-openapi__example-empty">No content</p>
      ) : (
        <CodeHighlight
          code={option.code}
          disableCopy
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
        remember
        subheader={
          <>
            <HttpMethod method={operation.method} />
            <code className="qui-docs-openapi__example-path">
              {operation.path}
            </code>
          </>
        }
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
