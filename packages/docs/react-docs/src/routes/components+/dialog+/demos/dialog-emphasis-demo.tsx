import type {ReactElement} from "react"

import type {QdsDialogEmphasis} from "@qualcomm-ui/qds-core/dialog"
import {Button} from "@qualcomm-ui/react/button"
import {Dialog} from "@qualcomm-ui/react/dialog"
import {LoremIpsum} from "@qualcomm-ui/react-core/lorem-ipsum"

const emphasis: QdsDialogEmphasis[] = [
  "neutral",
  "info",
  "success",
  "warning",
  "danger",
]

export function DialogEmphasisDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {emphasis.map((emp) => (
        <Dialog.Root key={emp} emphasis={emp}>
          <Dialog.Trigger>
            <Button size="sm" variant="outline">
              {emp}
            </Button>
          </Dialog.Trigger>
          <DialogContent />
        </Dialog.Root>
      ))}
    </div>
  )
}

function DialogContent() {
  return (
    <Dialog.FloatingPortal>
      <Dialog.Body>
        <Dialog.CloseButton />
        <Dialog.IndicatorIcon />
        <Dialog.Heading>Dialog Title</Dialog.Heading>
        <Dialog.Description>
          <LoremIpsum />
        </Dialog.Description>
      </Dialog.Body>

      <Dialog.Footer>
        <Dialog.CloseTrigger>
          <Button emphasis="primary" size="sm" variant="fill">
            Confirm
          </Button>
        </Dialog.CloseTrigger>
      </Dialog.Footer>
    </Dialog.FloatingPortal>
  )
}
