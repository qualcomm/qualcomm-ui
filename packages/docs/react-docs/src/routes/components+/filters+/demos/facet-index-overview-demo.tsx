import {type ReactElement, useState} from "react"

import {getFacetFilterSetProps} from "@qualcomm-ui/core/filter-set"
import {
  defineFilters,
  type FilterValues,
  listFilter,
} from "@qualcomm-ui/core/filters"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxGroupFilter} from "@qualcomm-ui/react/filters"
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

export function FacetIndexOverviewDemo(): ReactElement {
  const [value, setValue] = useState<LaptopFilters>({})
  const {ids} = facetIndex.filter({
    selections: {os: value.os ?? [], processor: value.processor ?? []},
  })

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      <FilterPanel.Root
        className="w-72"
        filters={filters}
        onValueChange={setValue}
        value={value}
        {...facetProps}
      >
        <FilterPanel.Filter filter={filters.processor}>
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
        <FilterPanel.Filter filter={filters.os}>
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
      </FilterPanel.Root>
      <ul className="text-neutral-primary font-body-md min-w-60 flex-1">
        {laptops
          .filter((laptop) => ids.includes(laptop.id))
          .map((laptop) => (
            <li key={laptop.id}>
              {laptop.id}: {laptop.os}, {laptop.processor}
            </li>
          ))}
      </ul>
    </div>
  )
}
