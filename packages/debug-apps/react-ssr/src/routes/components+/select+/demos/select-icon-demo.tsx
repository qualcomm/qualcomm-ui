import type {ReactElement} from "react"

import {MapPin} from "lucide-react"

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

export default function Demo(): ReactElement {
  return (
    // preview
    <Select
      className="w-48"
      collection={cityCollection}
      controlProps={{"aria-label": "City"}}
      icon={MapPin}
      placeholder="Select a city"
    />
    // preview
  )
}
