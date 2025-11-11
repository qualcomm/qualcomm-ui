import type {ReactElement} from "react"

import {Trash2} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"
import {Dialog} from "@qualcomm-ui/react/dialog"

export default function DialogAlertDialogDemo(): ReactElement {
  return (
    <Dialog.Root emphasis="danger" role="alertdialog">
      <Dialog.Trigger>
        <Button emphasis="danger" endIcon={Trash2} variant="outline">
          Delete Account
        </Button>
      </Dialog.Trigger>
      <Dialog.FloatingPortal>
        <Dialog.Body>
          <Dialog.IndicatorIcon />
          <Dialog.Heading>Are you sure?</Dialog.Heading>
          <Dialog.CloseButton />
          <Dialog.Description>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our systems.
          </Dialog.Description>
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button emphasis="neutral" size="sm" variant="outline">
              Cancel
            </Button>
          </Dialog.CloseTrigger>

          <Button emphasis="danger" size="sm" variant="fill">
            Confirm
          </Button>
        </Dialog.Footer>
      </Dialog.FloatingPortal>
    </Dialog.Root>
  )
}
