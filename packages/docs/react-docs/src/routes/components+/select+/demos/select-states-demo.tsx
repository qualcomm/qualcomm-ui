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

export default function Demo(): ReactElement {
  return (
    <div className="flex w-60 flex-col gap-4">
      {/* preview */}
      <Select
        className="w-48"
        collection={cityCollection}
        defaultValue={["San Diego"]}
        disabled
        label="Disabled"
      />
      <Select
        className="w-48"
        collection={cityCollection}
        defaultValue={["San Diego"]}
        label="Read only"
        readOnly
      />
      <Select
        className="w-48"
        collection={cityCollection}
        defaultValue={["San Diego"]}
        errorText="Invalid"
        invalid
        label="Invalid"
      />
      {/* preview */}
    </div>
  )
}
