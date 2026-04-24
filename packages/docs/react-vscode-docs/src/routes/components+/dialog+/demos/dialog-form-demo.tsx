import type {ReactElement} from "react"

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
import {DropdownInput} from "@qualcomm-ui/react-vscode/dropdown-input"
import {Field} from "@qualcomm-ui/react-vscode/field"
import {Input} from "@qualcomm-ui/react-vscode/input"

export function DialogFormDemo(): ReactElement {
  return (
    <Dialog>
      <DialogTrigger>
        {(bindings) => <Button {...bindings}>Create new project</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogStatus icon="info" />
        <DialogHeader>Create New Project</DialogHeader>
        <DialogCloseButton />

        <DialogBody className="w-full">
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-2">
              <span>Project Name</span>
              <Field>
                <Input
                  className="input-placeholder-fg rounded-[5px]"
                  placeholder="sample"
                />
              </Field>
            </div>
            <div className="flex flex-col gap-2">
              <span>Project Path</span>
              <Field className="place-content-center">
                <Input
                  className="input-placeholder-fg rounded-[5px]"
                  placeholder="local/mnt/workspaces/build"
                />
              </Field>
            </div>
            <div className="flex flex-col gap-2">
              <span>SDK Installed Location</span>
              <Field className="place-content-center">
                <Input
                  className="input-placeholder-fg rounded-[5px]"
                  placeholder="local/mnt/workspaces/build"
                />
              </Field>
            </div>
            <div className="flex flex-col gap-2">
              <span>Template</span>
              <DropdownInput defaultValue="C/C++" />
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary">Cancel</Button>
          <Button variant="secondary">Back</Button>
          <Button>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
