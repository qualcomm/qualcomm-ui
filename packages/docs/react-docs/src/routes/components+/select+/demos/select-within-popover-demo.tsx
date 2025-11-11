import type {ReactElement} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Button} from "@qualcomm-ui/react/button"
import {Popover} from "@qualcomm-ui/react/popover"
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
    <Popover
      label="Select Example"
      trigger={<Button emphasis="primary">Show Popover</Button>}
    >
      <Select
        className="w-48"
        collection={cityCollection}
        label="City"
        placeholder="Select a city"
        portalProps={{disabled: true}}
      />
    </Popover>
  )
}
