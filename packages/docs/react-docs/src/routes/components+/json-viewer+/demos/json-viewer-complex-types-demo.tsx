import type {ReactElement} from "react"

import {JsonViewer} from "@qualcomm-ui/react/json-viewer"

const users = new Map([
  ["alice", {active: true, role: "admin"}],
  ["bob", {active: false, role: "editor"}],
  ["charlie", {active: true, role: "viewer"}],
])

const tags = new Set(["typescript", "react", "design-system", "components"])

// Remove stack to avoid SSR hydration mismatch
// Server and client produce different stacks
function createDemoError<T extends Error>(error: T): T {
  error.stack = undefined
  return error
}

const data = {
  binary: new ArrayBuffer(16),
  callback: function onUpdate() {},
  errors: [
    createDemoError(new Error("Connection timeout")),
    createDemoError(new TypeError("Expected string, received number")),
  ],
  metadata: {
    endpoint: new URL("https://api.example.com/v1/users?active=true"),
    headers: new Headers({
      authorization: "Bearer token123",
      "content-type": "application/json",
    }),
    params: new URLSearchParams({limit: "20", page: "1", sort: "name"}),
  },
  tags,
  users,
}

export function JsonViewerComplexTypesDemo(): ReactElement {
  return (
    // preview
    <JsonViewer data={data} defaultExpandedDepth={2} />
    // preview
  )
}
