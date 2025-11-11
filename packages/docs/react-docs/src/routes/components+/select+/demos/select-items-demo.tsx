import type {ReactElement} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Select} from "@qualcomm-ui/react/select"

// preview
const cityCollection = selectCollection({
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
    <Select
      className="w-48"
      collection={cityCollection}
      controlProps={{"aria-label": "City"}}
      placeholder="Select a city"
    />
  )
}
