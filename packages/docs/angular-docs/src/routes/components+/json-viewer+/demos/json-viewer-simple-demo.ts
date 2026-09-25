import {Component} from "@angular/core"

import {JsonViewerModule} from "@qualcomm-ui/angular/json-viewer"

const data = {
  dependencies: {
    react: "^19.0.0",
    "react-dom": "^19.0.0",
    typescript: "^5.7.0",
  },
  engines: {
    node: ">=20",
  },
  name: "Qualcomm UI",
  private: true,
  scripts: {
    build: "turbo build",
    dev: "turbo dev",
    lint: "turbo lint",
  },
  version: "1.0.0",
}

@Component({
  imports: [JsonViewerModule],
  selector: "json-viewer-simple-demo",
  template: `
    <!-- preview -->
    <q-json-viewer
      [collapseStringsAfterLength]="50"
      [data]="data"
      [defaultExpandedDepth]="0"
      [maxPreviewItems]="7"
      [quotesOnKeys]="true"
    />
    <!-- preview -->
  `,
})
export class JsonViewerSimpleDemo {
  data = data
}
