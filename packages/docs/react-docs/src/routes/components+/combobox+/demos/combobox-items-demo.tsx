import type {ReactElement} from "react"

import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {Combobox} from "@qualcomm-ui/react/combobox"
import {useListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"

export function ComboboxItemsDemo(): ReactElement {
  const {contains} = useFilter({sensitivity: "base"})

  const {collection, filter} = useListCollection({
    filter: contains,
    initialItems: [
      // preview
      {name: "San Diego", value: "SD"},
      {name: "Nashville", value: "NV"},
      {name: "Denver", value: "DV"},
      {name: "Miami", value: "MI"},
      {name: "Las Vegas", value: "LV"},
      {name: "New York City", value: "NYC"},
      {name: "San Francisco", value: "SF"},
      // preview
    ],
    itemLabel: (item) => item.name,
    itemValue: (item) => item.value,
  })

  function handleInputChange(details: ComboboxInputValueChangeDetails) {
    filter(details.inputValue)
  }

  return (
    <Combobox
      className="w-48"
      collection={collection}
      label="City"
      onInputValueChange={handleInputChange}
      placeholder="Select a city"
    />
  )
}
