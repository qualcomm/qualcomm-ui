import {type ReactElement, useState} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {Collapsible} from "@qualcomm-ui/react/collapsible"

export default function CollapsibleControlledStateDemo(): ReactElement {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Collapsible.Root
      className="flex flex-col items-center"
      onOpenChange={setOpen}
      open={open}
    >
      <Collapsible.Trigger
        className="my-3"
        render={<Button emphasis="primary" />}
      >
        Toggle
      </Collapsible.Trigger>
      <Collapsible.Content>
        <div className="border-neutral-01 grid h-48 w-72 gap-4 rounded-sm border p-4">
          Content
          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
