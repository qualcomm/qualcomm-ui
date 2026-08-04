import type {ReactElement} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Select} from "@qualcomm-ui/react/select"

const cityCollection = selectCollection({
  items: ["San Diego", "Nashville", "Denver"],
})

export function SelectExplorerDemo(): ReactElement {
  return (
    <Select
      className="w-48"
      clearable
      collection={cityCollection}
      defaultOpen
      hint="Choose a location"
      label="City"
      placeholder="Select a city"
      portalProps={{disabled: true}}
    />
  )
}
