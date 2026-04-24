import type {ReactElement} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Button} from "@qualcomm-ui/react-vscode/button"
import {Dialog} from "@qualcomm-ui/react-vscode/dialog"
import {Field} from "@qualcomm-ui/react-vscode/field"
import {Input} from "@qualcomm-ui/react-vscode/text-input"
import {Select} from "@qualcomm-ui/react-vscode/select"

const templateCollection = selectCollection({
  items: [
    {label: "C/C++", value: "cpp"},
    {label: "Python", value: "python"},
  ],
})

export function DialogFormDemo(): ReactElement {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {(bindings) => <Button {...bindings}>Create new project</Button>}
      </Dialog.Trigger>
      <Dialog.FloatingPortal>
        <Dialog.Body>
          <Dialog.IndicatorIcon variant="info" />
          <Dialog.Heading>Create New Project</Dialog.Heading>
          <Dialog.CloseButton />
          <Dialog.Description>
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
                <Select collection={templateCollection} defaultValue={["cpp"]}>
                  {templateCollection.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      <Select.ItemText>{item.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select>
              </div>
            </div>
          </Dialog.Description>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="secondary">Cancel</Button>
          <Button variant="secondary">Back</Button>
          <Button>Add</Button>
        </Dialog.Footer>
      </Dialog.FloatingPortal>
    </Dialog.Root>
  )
}
