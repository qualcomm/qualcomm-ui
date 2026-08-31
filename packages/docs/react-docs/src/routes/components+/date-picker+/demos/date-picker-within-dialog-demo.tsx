import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {DatePicker} from "@qualcomm-ui/react/date-picker"
import {Dialog} from "@qualcomm-ui/react/dialog"

export function DatePickerWithinDialogDemo(): ReactElement {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button emphasis="primary" variant="fill">
          Open Dialog
        </Button>
      </Dialog.Trigger>
      <Dialog.FloatingPortal>
        <Dialog.Body>
          <Dialog.Heading>Book a Flight</Dialog.Heading>
          <Dialog.CloseButton />
          <DatePicker
            className="w-64"
            label="Departure date"
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
