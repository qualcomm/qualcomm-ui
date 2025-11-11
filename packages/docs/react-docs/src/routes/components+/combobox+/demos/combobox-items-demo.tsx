import type {ReactElement} from "react"

import {comboboxCollection} from "@qualcomm-ui/core/combobox"
import {Combobox} from "@qualcomm-ui/react/combobox"

// preview
const cityCollection = comboboxCollection({
  itemLabel: (item) => item.name,
  items: [
    {name: "San Diego", value: "SD"},
    {name: "Nashville", value: "NV"},
    {name: "Denver", value: "DV"},
    {name: "Miami", value: "MI"},
    {name: "Las Vegas", value: "LV"},
    {name: "New York City", value: "NYC"},
    {name: "San Francisco", value: "SF"},
  ],
  itemValue: (item) => item.value,
})
// preview

export default function Demo(): ReactElement {
  return (
    <Combobox
      className="w-48"
      collection={cityCollection}
      label="City"
      placeholder="Select a city"
    />
  )
}
