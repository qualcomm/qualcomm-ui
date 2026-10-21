import {Component} from "@angular/core"

import {JsonViewerModule} from "@qualcomm-ui/angular/json-viewer"

const data = {
  settings: {
    notifications: {
      email: true,
      push: false,
    },
    theme: "dark",
  },
  users: [
    {id: 1, name: "Alice", roles: ["admin", "editor"]},
    {id: 2, name: "Bob", roles: ["viewer"]},
  ],
}

@Component({
  imports: [JsonViewerModule],
  selector: "json-viewer-composite-demo",
  template: `
    <!-- preview -->
    <q-json-viewer-root [data]="data" [defaultExpandedDepth]="3">
      <q-json-viewer-tree />
    </q-json-viewer-root>
    <!-- preview -->
  `,
})
export class JsonViewerCompositeDemo {
  data = data
}
