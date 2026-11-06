import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {JsonViewerModule} from "@qualcomm-ui/angular/json-viewer"

@Component({
  imports: [JsonViewerModule, ButtonModule],
  selector: "json-viewer-controlled-demo",
  template: `
    <div class="w-full">
      <!-- preview -->
      <div class="mb-2 flex gap-2">
        <button
          q-button
          (click)="expanded = viewer.collection().getBranchValues()"
        >
          Expand all
        </button>
        <button q-button (click)="expanded = []">Collapse all</button>
      </div>
      <div
        #viewer="jsonViewerRoot"
        q-json-viewer-root
        [data]="data"
        [expandedValue]="expanded"
        (expandedValueChange)="expanded = $event"
      >
        <div q-json-viewer-tree></div>
      </div>
      <!-- preview -->
      <output class="font-body-sm text-neutral-primary mt-2 block">
        {{ expanded.length }} of
        {{ viewer.collection().getBranchValues().length }}
        branches expanded
      </output>
    </div>
  `,
})
export class JsonViewerControlledDemo {
  readonly data = {
    founded: 1985,
    name: "Qualcomm",
    products: {
      chips: ["Snapdragon 8 Gen 3", "Snapdragon 7+ Gen 2"],
      modems: ["X75", "X72"],
    },
    public: true,
  }

  expanded: string[] = []
}
