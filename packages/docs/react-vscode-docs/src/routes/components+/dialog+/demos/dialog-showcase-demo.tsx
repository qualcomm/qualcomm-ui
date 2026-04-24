import type {ReactNode} from "react"

import {Button} from "@qualcomm-ui/react-vscode/button"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogStatus,
  DialogTrigger,
} from "@qualcomm-ui/react-vscode/dialog"

export function DialogShowcaseDemo(): ReactNode {
  return (
    <Dialog>
      <DialogTrigger>
        {(bindings) => <Button {...bindings}>Show Dialog</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogStatus icon="info" />
        <DialogHeader>
          Do you want to save the changes you made to Untitled-1.txt?
        </DialogHeader>
        <DialogCloseButton />
        <DialogBody>
          Your changes will be lost if you don't save them.
        </DialogBody>
        <DialogFooter>
          <DialogCloseButton />
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
