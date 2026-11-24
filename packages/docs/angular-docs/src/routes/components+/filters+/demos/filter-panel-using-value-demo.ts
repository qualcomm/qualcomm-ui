import {Component, computed, signal} from "@angular/core"

import {FilterPanelModule} from "@qualcomm-ui/angular/filter-panel"
import {FiltersModule} from "@qualcomm-ui/angular/filters"
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

type BuildFilters = FilterValues<typeof filters>

function toSearchParams(value: BuildFilters): URLSearchParams {
  const params = new URLSearchParams()
  for (const status of value.status ?? []) {
    params.append("status", status)
  }
  const [architecture] = value.architecture ?? []
  if (architecture) {
    params.set("architecture", architecture)
  }
  for (const platform of value.platform ?? []) {
    params.append("platform", platform)
  }
  return params
}

@Component({
  imports: [FilterPanelModule, FiltersModule],
  selector: "filter-panel-using-value-demo",
  template: `
    <div class="flex w-full max-w-3xl flex-wrap items-start gap-6">
      <div
        applyMode="manual"
        class="w-72"
        q-filter-panel-root
        [filters]="filters"
        (valueChanged)="params.set(toSearchParams($event))"
      >
        <div q-filter-panel-filter [filter]="filters.status">
          <q-checkbox-group-filter />
        </div>
        <div q-filter-panel-filter [filter]="filters.architecture">
          <q-radio-group-filter />
        </div>
        <div q-filter-panel-filter [filter]="filters.platform">
          <q-checkbox-tree-filter [defaultExpandedValue]="['desktop']" />
        </div>
        <div q-filter-panel-footer>
          <button q-filter-panel-apply-button></button>
        </div>
      </div>
      <pre
        class="border-neutral-01 font-code-sm text-neutral-primary min-w-60 flex-1 rounded border p-3"
        >{{ url() }}</pre>
    </div>
  `,
})
export class FilterPanelUsingValueDemo {
  readonly filters = filters
  readonly params = signal(new URLSearchParams())
  readonly toSearchParams = toSearchParams

  readonly url = computed(
    () => `/builds?${this.params().toString().replaceAll("&", "\n  &")}`,
  )
}
