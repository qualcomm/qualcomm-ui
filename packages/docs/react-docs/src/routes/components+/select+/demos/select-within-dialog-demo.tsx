import type {ReactElement} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Button} from "@qualcomm-ui/react/button"
import {Dialog} from "@qualcomm-ui/react/dialog"
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
    <Dialog.Root>
      <Dialog.Trigger>
        <Button emphasis="primary" variant="fill">
          Open Dialog
        </Button>
      </Dialog.Trigger>
      <Dialog.FloatingPortal>
        <Dialog.Body>
          <Dialog.Heading>Dialog Title</Dialog.Heading>
          <Dialog.CloseButton />
          <Select
            className="w-48"
            collection={cityCollection}
            controlProps={{"aria-label": "City"}}
            placeholder="Select a city"
            portalProps={{disabled: true}}
          />
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button emphasis="primary" size="sm" variant="fill">
              Confirm
            </Button>
          </Dialog.CloseTrigger>
        </Dialog.Footer>
      </Dialog.FloatingPortal>
    </Dialog.Root>
  )
}
