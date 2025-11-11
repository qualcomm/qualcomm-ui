import type {ReactElement} from "react"

import type {QdsDialogPlacement} from "@qualcomm-ui/qds-core/dialog"
import {Button} from "@qualcomm-ui/react/button"
import {Dialog} from "@qualcomm-ui/react/dialog"

const placement: QdsDialogPlacement[] = ["top", "center", "bottom"]

export default function DialogPlacementDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {placement.map((plc) => (
        <Dialog.Root key={plc} placement={plc}>
          <Dialog.Trigger>
            <Button emphasis="neutral" size="sm" variant="outline">
              Open Dialog ({plc})
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
      ))}
    </div>
  )
}
