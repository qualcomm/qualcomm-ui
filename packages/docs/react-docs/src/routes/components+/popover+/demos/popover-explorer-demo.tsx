import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {Popover} from "@qualcomm-ui/react/popover"

export function PopoverExplorerDemo(): ReactElement {
  return (
    <Popover.Root
      defaultOpen
      portalled={false}
      positioning={{placement: "bottom"}}
    >
      <Popover.Anchor>
        <Popover.Trigger>
          <Button emphasis="primary">Show Popover</Button>
        </Popover.Trigger>
      </Popover.Anchor>
      <Popover.Positioner>
        <Popover.Content>
          <Popover.Arrow>
            <Popover.ArrowTip />
          </Popover.Arrow>
          <Popover.Label>Label</Popover.Label>
          <Popover.Description>
            Popover content with a description.
          </Popover.Description>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}
