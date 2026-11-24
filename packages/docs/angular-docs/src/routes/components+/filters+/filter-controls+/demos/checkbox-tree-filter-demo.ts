import {Component, signal} from "@angular/core"

import {FilterPanelModule} from "@qualcomm-ui/angular/filter-panel"
import {FiltersModule} from "@qualcomm-ui/angular/filters"
import {JsonViewerModule} from "@qualcomm-ui/angular/json-viewer"
import {
  defineFilters,
  type FilterValues,
  treeFilter,
} from "@qualcomm-ui/core/filters"
import {createTreeCollection} from "@qualcomm-ui/core/tree"

interface ChipsetNode {
  id: string
  nodes?: ChipsetNode[]
  text: string
}

const chipsets = createTreeCollection<ChipsetNode>({
  nodeText: "text",
  nodeValue: "id",
  rootNode: {
    id: "ROOT",
    nodes: [
      {
        id: "snapdragon-x",
        nodes: [
          {id: "x1e-84-100", text: "X1E-84-100"},
          {id: "x1e-80-100", text: "X1E-80-100"},
          {id: "x1p-64-100", text: "X1P-64-100"},
        ],
        text: "Snapdragon X",
      },
      {
        id: "snapdragon-8",
        nodes: [
          {id: "sm8750", text: "SM8750"},
          {id: "sm8650", text: "SM8650"},
        ],
        text: "Snapdragon 8",
      },
    ],
    text: "",
  },
})

const filters = defineFilters({
  chipset: treeFilter({collection: chipsets, label: "Chipset"}),
})

@Component({
  imports: [FilterPanelModule, FiltersModule, JsonViewerModule],
  selector: "checkbox-tree-filter-demo",
  template: `
    <div class="flex w-full max-w-3xl flex-wrap items-start gap-6">
      <!-- preview -->
      <div
        class="w-72"
        q-filter-panel-root
        [filters]="filters"
        (valueChanged)="value.set($event)"
      >
        <div q-filter-panel-filter [filter]="filters.chipset">
          <q-checkbox-tree-filter [defaultExpandedValue]="['snapdragon-x']" />
        </div>
      </div>
      <!-- preview -->
      <div class="min-w-60 flex-1" q-json-viewer [data]="value()"></div>
    </div>
  `,
})
export class CheckboxTreeFilterDemo {
  readonly filters = filters
  readonly value = signal<FilterValues<typeof filters>>({})
}
