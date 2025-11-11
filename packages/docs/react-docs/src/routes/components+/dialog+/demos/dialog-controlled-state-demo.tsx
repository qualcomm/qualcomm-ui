import {type ReactElement, useState} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {Dialog} from "@qualcomm-ui/react/dialog"

export default function DialogControlledStateDemo(): ReactElement {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger>
        <Button emphasis="primary" variant="fill">
          Open Dialog
        </Button>
      </Dialog.Trigger>
      <Dialog.FloatingPortal>
        <Dialog.Body>
          <Dialog.Heading>Dialog Title</Dialog.Heading>
          <Dialog.CloseButton />
          <Dialog.Description>Dialog Description</Dialog.Description>
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
