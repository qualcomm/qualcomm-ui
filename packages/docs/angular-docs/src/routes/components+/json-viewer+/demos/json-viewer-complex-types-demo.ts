import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {JsonViewerModule} from "@qualcomm-ui/angular/json-viewer"
import {SwitchModule} from "@qualcomm-ui/angular/switch"

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

@Component({
  imports: [JsonViewerModule, SwitchModule, FormsModule],
  selector: "json-viewer-complex-types-demo",
  template: `
    <!-- preview -->
    <div class="flex w-full flex-col gap-3">
      <label
        label="Show expanded brackets"
        q-switch
        [(ngModel)]="showExpandedBrackets"
      ></label>
      <div
        q-json-viewer
        [data]="data"
        [defaultExpandedDepth]="2"
        [showExpandedBrackets]="showExpandedBrackets()"
      ></div>
    </div>
    <!-- preview -->
  `,
})
export class JsonViewerComplexTypesDemo {
  data = data
  readonly showExpandedBrackets = signal(true)
}
