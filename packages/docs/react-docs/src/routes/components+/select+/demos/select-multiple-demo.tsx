import type {ReactElement} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Select} from "@qualcomm-ui/react/select"

const cityCollection = selectCollection({
  items: [
    "San Diego",
    "Nashville",
    "Denver",
    "Miami",
    "Las Vegas",
    "New York City",
    "San Francisco",
  ],
})

export function SelectMultipleDemo(): ReactElement {
  return (
    // preview
    <Select
      className="w-72"
      collection={cityCollection}
      controlProps={{"aria-label": "City"}}
      multiple
      placeholder="Select a city"
    />
    // preview
  )
}
