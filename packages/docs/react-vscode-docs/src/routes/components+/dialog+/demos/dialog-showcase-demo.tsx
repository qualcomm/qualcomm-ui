import type {ReactNode} from "react"

import {Button} from "@qualcomm-ui/react-vscode/button"
import {Dialog} from "@qualcomm-ui/react-vscode/dialog"

export function DialogShowcaseDemo(): ReactNode {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {(bindings) => <Button {...bindings}>Show Dialog</Button>}
      </Dialog.Trigger>
      <Dialog.FloatingPortal>
        <Dialog.Body>
          <Dialog.IndicatorIcon variant="info" />
          <Dialog.Heading>
            Do you want to save the changes you made to Untitled-1.txt?
          </Dialog.Heading>
          <Dialog.CloseButton />
          <Dialog.Description>
            Your changes will be lost if you don't save them.
          </Dialog.Description>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button>Cancel</Button>
          </Dialog.CloseTrigger>
          <Button>Save</Button>
        </Dialog.Footer>
      </Dialog.FloatingPortal>
    </Dialog.Root>
  )
}
