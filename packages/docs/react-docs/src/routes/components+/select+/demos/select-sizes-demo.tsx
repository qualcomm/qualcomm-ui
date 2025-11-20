import type {ReactElement} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Select} from "@qualcomm-ui/react/select"

const cityCollection = selectCollection({
  items: ["San Diego", "Dallas", "Denver"],
})

export function SelectSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-4">
      <Select
        className="w-40"
        collection={cityCollection}
        controlProps={{"aria-label": "City"}}
        placeholder="sm"
        positioning={{sameWidth: true}}
        size="sm"
      />
      <Select
        className="w-48"
        collection={cityCollection}
        controlProps={{"aria-label": "City"}}
        placeholder="md"
        positioning={{sameWidth: true}}
        size="md"
      />
      <Select
        className="w-56"
        collection={cityCollection}
        controlProps={{"aria-label": "City"}}
        placeholder="lg"
        positioning={{sameWidth: true}}
        size="lg"
      />
    </div>
  )
}
