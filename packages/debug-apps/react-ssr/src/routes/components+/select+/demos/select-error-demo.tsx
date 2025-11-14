import {type ReactElement, useState} from "react"

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
  const [value, setValue] = useState<string[]>([])
  return (
    // preview
    <Select
      className="w-48"
      collection={cityCollection}
      controlProps={{"aria-label": "City"}}
      errorText="You must select a city"
      invalid={!value.length}
      onValueChange={setValue}
      placeholder="Select a city"
      value={value}
    />
    // preview
  )
}
