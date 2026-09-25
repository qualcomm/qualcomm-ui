import {Component} from "@angular/core"

import {JsonViewerModule} from "@qualcomm-ui/angular/json-viewer"

const users = new Map([
  ["alice", {active: true, role: "admin"}],
  ["bob", {active: false, role: "editor"}],
  ["charlie", {active: true, role: "viewer"}],
])

const tags = new Set(["typescript", "angular", "design-system", "components"])

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

@Component({
  imports: [JsonViewerModule],
  selector: "json-viewer-complex-types-demo",
  template: `
    <!-- preview -->
    <q-json-viewer [data]="data" [defaultExpandedDepth]="2" />
    <!-- preview -->
  `,
})
export class JsonViewerComplexTypesDemo {
  data = data
}
