import type {ReactNode} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {Popover} from "@qualcomm-ui/react/popover"
import {Portal} from "@qualcomm-ui/react-core/portal"

export default function PopoverCompositeDemo(): ReactNode {
  return (
    // preview
    <Popover.Root>
      <Popover.Anchor>
        <Popover.Trigger>
          <Button emphasis="primary">Show Popover</Button>
        </Popover.Trigger>
      </Popover.Anchor>

      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Label>Label</Popover.Label>
            <Popover.Description>Description</Popover.Description>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
    // preview
  )
}
