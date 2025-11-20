import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {Dialog, useQdsDialogContext} from "@qualcomm-ui/react/dialog"
import {LoremIpsum} from "@qualcomm-ui/react-core/lorem-ipsum"

export function DialogSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <Dialog.Root size="sm">
        <Dialog.Trigger>
          <Button emphasis="primary" variant="fill">
            Open Dialog (sm)
          </Button>
        </Dialog.Trigger>
        <DialogContent />
      </Dialog.Root>

      <Dialog.Root size="md">
        <Dialog.Trigger>
          <Button emphasis="primary" variant="fill">
            Open Dialog (md)
          </Button>
        </Dialog.Trigger>
        <DialogContent />
      </Dialog.Root>
    </div>
  )
}

function DialogContent() {
  const context = useQdsDialogContext()
  return (
    <Dialog.FloatingPortal>
      <Dialog.Body>
        <Dialog.Heading>Dialog Title ({context.size})</Dialog.Heading>
        <Dialog.CloseButton />
        <Dialog.Description>
          <LoremIpsum />
        </Dialog.Description>
      </Dialog.Body>

      <Dialog.Footer>
        <Dialog.CloseTrigger>
          <Button size="sm" variant="outline">
            Cancel
          </Button>
        </Dialog.CloseTrigger>
        <Dialog.CloseTrigger>
          <Button emphasis="primary" size="sm" variant="fill">
            Confirm
          </Button>
        </Dialog.CloseTrigger>
      </Dialog.Footer>
    </Dialog.FloatingPortal>
  )
}
