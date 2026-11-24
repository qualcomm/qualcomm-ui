import {Component, signal} from "@angular/core"

import {FilterPanelModule} from "@qualcomm-ui/angular/filter-panel"
import {FiltersModule} from "@qualcomm-ui/angular/filters"
import {JsonViewerModule} from "@qualcomm-ui/angular/json-viewer"
import {
  defineFilters,
  type FilterValues,
  listFilter,
  treeFilter,
} from "@qualcomm-ui/core/filters"
import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {ListCollection} from "@qualcomm-ui/utils/collection"

interface PlatformNode {
  id: string
  nodes?: PlatformNode[]
  text: string
}

const platforms = createTreeCollection<PlatformNode>({
  nodeText: "text",
  nodeValue: "id",
  rootNode: {
    id: "ROOT",
    nodes: [
      {
        id: "desktop",
        nodes: [
          {id: "linux", text: "Linux"},
          {id: "macos", text: "macOS"},
          {id: "windows", text: "Windows"},
        ],
        text: "Desktop",
      },
      {
        id: "mobile",
        nodes: [
          {id: "android", text: "Android"},
          {id: "ios", text: "iOS"},
        ],
        text: "Mobile",
      },
    ],
    text: "",
  },
})

const filters = defineFilters({
  architecture: listFilter({
    collection: new ListCollection({items: ["arm64", "x86-64"]}),
    label: "Architecture",
  }),
  platform: treeFilter({collection: platforms, label: "Platform"}),
  status: listFilter({
    collection: new ListCollection({items: ["Failed", "Passed", "Queued"]}),
    label: "Status",
  }),
})

@Component({
  imports: [FilterPanelModule, FiltersModule, JsonViewerModule],
  selector: "filter-panel-basic-demo",
  template: `
    <div class="flex w-full max-w-3xl flex-wrap items-start gap-6">
      <!-- preview -->
      <div
        class="w-72"
        q-filter-panel-root
        [filters]="filters"
        (valueChanged)="value.set($event)"
      >
        <div q-filter-panel-header>
          <div q-filter-panel-heading>
            Filters
            <span q-filter-panel-count></span>
          </div>
          <button q-filter-panel-clear-button></button>
        </div>
        <div q-filter-panel-filter [filter]="filters.status">
          <q-checkbox-group-filter />
        </div>
        <div q-filter-panel-filter [filter]="filters.architecture">
          <q-radio-group-filter />
        </div>
        <div q-filter-panel-filter [filter]="filters.platform">
          <q-checkbox-tree-filter [defaultExpandedValue]="['desktop']" />
        </div>
      </div>
      <!-- preview -->
      <div class="min-w-60 flex-1" q-json-viewer [data]="value()"></div>
    </div>
  `,
})
export class FilterPanelBasicDemo {
  readonly filters = filters
  readonly value = signal<FilterValues<typeof filters>>({})
}
