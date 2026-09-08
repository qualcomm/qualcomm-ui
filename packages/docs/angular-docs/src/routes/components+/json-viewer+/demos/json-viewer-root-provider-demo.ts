import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {
  createJsonViewerState,
  JsonViewerModule,
} from "@qualcomm-ui/angular/json-viewer"

const data = {
  founded: 1985,
  name: "Qualcomm",
  products: {
    chips: ["Snapdragon 8 Gen 3", "Snapdragon 7+ Gen 2"],
    modems: ["X75", "X72"],
  },
  public: true,
}

@Component({
  imports: [JsonViewerModule, ButtonModule],
  selector: "json-viewer-root-provider-demo",
  template: `
    <div class="w-full">
      <div class="mb-2 flex gap-2">
        <button q-button (click)="expandAll()">Expand all</button>
        <button q-button (click)="collapseAll()">Collapse all</button>
      </div>
      <!-- preview -->
      <q-json-viewer-root-provider
        [expandedValue]="expanded"
        [value]="viewer"
        (expandedValueChange)="expanded = $event"
      >
        <q-json-viewer-tree />
      </q-json-viewer-root-provider>
      <!-- preview -->
      <output class="font-body-sm text-neutral-primary mt-2 block">
        {{ expanded.length }} of {{ totalBranches }} branches expanded
      </output>
    </div>
  `,
})
export class JsonViewerRootProviderDemo {
  viewer = createJsonViewerState({data, defaultExpandedDepth: 1})
  expanded: string[] = this.viewer.defaultExpandedValue ?? []
  totalBranches = this.viewer.collection.getBranchValues().length

  expandAll() {
    this.expanded = this.viewer.collection.getBranchValues()
  }

  collapseAll() {
    this.expanded = []
  }
}
