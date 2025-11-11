import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {Dialog} from "@qualcomm-ui/react/dialog"
import {LoremIpsum} from "@qualcomm-ui/react-core/lorem-ipsum"

export default function DialogOutsideScrollDemo(): ReactElement {
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
          <Dialog.Description>
            <LoremIpsum numParagraphs={20} />
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
    </Dialog.Root>
  )
}
