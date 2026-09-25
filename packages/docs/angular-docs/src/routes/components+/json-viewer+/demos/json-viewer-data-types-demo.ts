import {Component} from "@angular/core"

import {JsonViewerModule} from "@qualcomm-ui/angular/json-viewer"

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

@Component({
  imports: [JsonViewerModule],
  selector: "json-viewer-data-types-demo",
  template: `
    <!-- preview -->
    <q-json-viewer [data]="data" [defaultExpandedDepth]="2" />
    <!-- preview -->
  `,
})
export class JsonViewerDataTypesDemo {
  data = data
}
