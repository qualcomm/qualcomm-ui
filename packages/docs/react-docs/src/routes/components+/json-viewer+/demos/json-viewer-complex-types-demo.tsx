import {type ReactElement, useState} from "react"

import {JsonViewer} from "@qualcomm-ui/react/json-viewer"
import {Switch} from "@qualcomm-ui/react/switch"

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
  booleanStack: {stack: false},
  callback: function onUpdate() {},
  dateMap: new Map([
    ["valid", new Date("2025-01-01T00:00:00.000Z")],
    ["invalid", new Date(NaN)],
  ]),
  dateSet: new Set([new Date("2025-01-01T00:00:00.000Z"), new Date(NaN)]),
  errors: [
    createDemoError(new Error("Connection timeout")),
    createDemoError(new TypeError("Expected string, received number")),
  ],
  invalidDate: new Date(NaN),
  metadata: {
    endpoint: new URL("https://api.example.com/v1/users?active=true"),
    headers: new Headers({
      authorization: "Bearer token123",
      "content-type": "application/json",
    }),
    params: new URLSearchParams({limit: "20", page: "1", sort: "name"}),
  },
  nullConstructor: {constructor: null, name: "value"},
  nullPrototype: Object.assign(Object.create(null) as Record<string, unknown>, {
    name: "value",
  }),
  numericStack: {stack: 42},
  tags,
  typedArray: new Uint8Array([1, 2]),
  users,
}

export function JsonViewerComplexTypesDemo(): ReactElement {
  const [showExpandedBrackets, setShowExpandedBrackets] = useState(true)

  return (
    // preview
    <div className="flex w-full flex-col gap-3">
      <Switch
        checked={showExpandedBrackets}
        label="Show expanded brackets"
        onCheckedChange={setShowExpandedBrackets}
      />
      <JsonViewer
        data={data}
        defaultExpandedDepth={2}
        showExpandedBrackets={showExpandedBrackets}
      />
    </div>
    // preview
  )
}
