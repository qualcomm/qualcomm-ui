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

export function SelectMaxHeightDemo(): ReactElement {
  return (
    // preview
    <Select
      className="w-48"
      collection={cityCollection}
      contentProps={{style: {maxHeight: 240}}}
      controlProps={{"aria-label": "City"}}
      placeholder="Select a city"
      positioning={{sameWidth: true}}
    />
    // preview
  )
}
