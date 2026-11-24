import {Component, computed, signal} from "@angular/core"

import {FilterPanelModule} from "@qualcomm-ui/angular/filter-panel"
import {FiltersModule} from "@qualcomm-ui/angular/filters"
import {getFacetFilterSetProps} from "@qualcomm-ui/core/filter-set"
import {
  defineFilters,
  type FilterValues,
  listFilter,
} from "@qualcomm-ui/core/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"
import {FacetIndex} from "@qualcomm-ui/utils/facet-index"

const laptops = [
  {id: "1", os: "Windows", processor: "AMD Ryzen 9"},
  {id: "2", os: "Linux", processor: "AMD Ryzen 9"},
  {id: "3", os: "macOS", processor: "Apple M-series"},
  {id: "4", os: "macOS", processor: "Apple M-series"},
  {id: "5", os: "macOS", processor: "Apple M-series"},
  {id: "6", os: "Windows", processor: "Intel Core i9"},
  {id: "7", os: "Linux", processor: "Intel Core i9"},
  {id: "8", os: "Windows", processor: "Snapdragon X Elite"},
  {id: "9", os: "Linux", processor: "Snapdragon X Elite"},
]

const filters = defineFilters({
  os: listFilter({
    collection: new ListCollection({items: ["Windows", "macOS", "Linux"]}),
    label: "Operating system",
  }),
  processor: listFilter({
    collection: new ListCollection({
      items: [
        "AMD Ryzen 9",
        "Apple M-series",
        "Intel Core i9",
        "Snapdragon X Elite",
      ],
    }),
    label: "Processor",
  }),
})

const facetIndex = new FacetIndex(laptops, {
  fields: {os: {}, processor: {}},
})

type LaptopFilters = FilterValues<typeof filters>

const facetProps = getFacetFilterSetProps<typeof filters>(facetIndex)

@Component({
  imports: [FilterPanelModule, FiltersModule],
  selector: "facet-index-overview-demo",
  template: `
    <div class="flex w-full max-w-3xl flex-wrap items-start gap-6">
      <div
        class="w-72"
        q-filter-panel-root
        [filters]="filters"
        [getFilterCollection]="facetProps.getFilterCollection"
        [getFilterOptionCounts]="facetProps.getFilterOptionCounts"
        [value]="value()"
        (valueChanged)="value.set($event)"
      >
        <div q-filter-panel-filter [filter]="filters.processor">
          <q-checkbox-group-filter />
        </div>
        <div q-filter-panel-filter [filter]="filters.os">
          <q-checkbox-group-filter />
        </div>
      </div>
      <ul class="text-neutral-primary font-body-md min-w-60 flex-1">
        @for (laptop of results(); track laptop.id) {
          <li>{{ laptop.id }}: {{ laptop.os }}, {{ laptop.processor }}</li>
        }
      </ul>
    </div>
  `,
})
export class FacetIndexOverviewDemo {
  readonly facetProps = facetProps
  readonly filters = filters
  readonly value = signal<LaptopFilters>({})

  readonly results = computed(() => {
    const value = this.value()
    const {ids} = facetIndex.filter({
      selections: {os: value.os ?? [], processor: value.processor ?? []},
    })
    return laptops.filter((laptop) => ids.includes(laptop.id))
  })
}
