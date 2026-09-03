import type {ReactElement} from "react"

import {JsonViewer} from "@qualcomm-ui/react/json-viewer"

const data = {
  array: [1, "two", false],
  boolean: true,
  float: 3.14159,
  nested: {
    date: new Date("2025-01-01"),
    regex: /[a-z]+/gi,
    symbol: Symbol("example"),
  },
  null: null,
  number: 42,
  string: "hello world",
  undefined,
}

export function JsonViewerDataTypesDemo(): ReactElement {
  return (
    // preview
    <JsonViewer data={data} defaultExpandedDepth={2} />
    // preview
  )
}
