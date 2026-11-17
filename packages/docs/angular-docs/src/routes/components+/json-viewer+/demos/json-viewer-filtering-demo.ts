import {ChangeDetectorRef, Component, inject, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"
import {LucideSearch} from "@lucide/angular"

import {useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {JsonViewerModule} from "@qualcomm-ui/angular/json-viewer"
import {TextInputModule} from "@qualcomm-ui/angular/text-input"
import {TreeModule} from "@qualcomm-ui/angular/tree"
import {createJsonViewerCollection} from "@qualcomm-ui/qds-core/json-viewer"
import type {TreeCollection} from "@qualcomm-ui/utils/collection"
import {debounce} from "@qualcomm-ui/utils/functions"
import {type JsonNode, keyPathToKey} from "@qualcomm-ui/utils/json-tree"
import {matchSorter, Rankings} from "@qualcomm-ui/utils/match-sorter"

import data from "../../../../../../shared/data/1mb.json"

const initialCollection = createJsonViewerCollection(data, {
  showNonenumerable: false,
})
const defaultExpandedValue = initialCollection.getBranchValues(undefined, {
  depth: (depth) => depth <= 1,
})
const emptyCollection = initialCollection.copy({
  ...initialCollection.rootNode,
  children: [],
})

@Component({
  imports: [JsonViewerModule, TreeModule, TextInputModule, FormsModule],
  providers: [provideIcons({LucideSearch})],
  selector: "json-viewer-filtering-demo",
  template: `
    <div class="w-full">
      <q-text-input
        aria-label="Search JSON keys and values"
        class="mb-1"
        placeholder="Search keys and values: 'Stefan'"
        size="sm"
        startIcon="Search"
        [ngModel]="query()"
        (ngModelChange)="search($event)"
      />
      <div
        class="max-h-96 overflow-auto"
        q-json-viewer-root
        [data]="data"
        [showNonenumerable]="false"
      >
        <div
          lazyMount
          q-tree-root
          unmountOnExit
          [collection]="collection()"
          [expandedValue]="expanded()"
          (expandedValueChanged)="expanded.set($event.expandedValue)"
        >
          <div q-json-viewer-tree></div>
        </div>
      </div>
      @if (
        query() && !collection().getNodeChildren(collection().rootNode).length
      ) {
        <p class="font-body-sm text-neutral-secondary" role="status">
          No matching keys or values.
        </p>
      }
    </div>
  `,
})
export class JsonViewerFilteringDemo {
  readonly data = data
  readonly collection = signal<TreeCollection<JsonNode>>(initialCollection)
  readonly expanded = signal<string[]>(defaultExpandedValue)
  readonly query = signal("")

  private readonly changeDetectorRef = inject(ChangeDetectorRef)
  private readonly onDestroy = useOnDestroy()
  private readonly debouncedSearch = debounce(
    (value: string) => this.filter(value),
    300,
  )

  constructor() {
    this.onDestroy(this.debouncedSearch.clear)
  }

  search(value: string) {
    this.query.set(value)

    if (!value) {
      this.debouncedSearch.clear()
      // Remove expanded children before restoring the full collection.
      this.collection.set(emptyCollection)
      this.expanded.set(defaultExpandedValue)
      this.changeDetectorRef.detectChanges()
      this.collection.set(initialCollection)
      return
    }

    this.debouncedSearch(value)
  }

  private filter(value: string) {
    const nodes = matchSorter(initialCollection.getDescendantNodes(), value, {
      keys: [
        (node) => keyPathToKey(node.keyPath, {excludeRoot: true}),
        (node) =>
          initialCollection.isBranchNode(node) ? "" : String(node.value),
      ],
      threshold: Rankings.CONTAINS,
    })
    const matchingValues = new Set(nodes.map(initialCollection.getNodeValue))
    const nextCollection = initialCollection.filter((node) =>
      matchingValues.has(initialCollection.getNodeValue(node)),
    )
    this.collection.set(nextCollection)
    this.expanded.set(nextCollection.getBranchValues())
  }
}
