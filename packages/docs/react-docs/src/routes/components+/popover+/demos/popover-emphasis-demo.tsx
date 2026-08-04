import type {ReactElement} from "react"

import type {QdsPopoverEmphasis} from "@qualcomm-ui/qds-core/popover"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {Button} from "@qualcomm-ui/react/button"
import {Popover} from "@qualcomm-ui/react/popover"

const emphasisOptions: QdsPopoverEmphasis[] = ["neutral", "brand"]

export function PopoverEmphasisDemo(): ReactElement {
  return (
    <div className="flex gap-4">
      {emphasisOptions.map((emphasis) => (
        <Popover.Root key={emphasis} emphasis={emphasis}>
          <Popover.Anchor>
            <Popover.Trigger>
              <Button emphasis="primary">{emphasis}</Button>
            </Popover.Trigger>
          </Popover.Anchor>

          <Portal>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Arrow />
                <Popover.Label>Label</Popover.Label>
                <Popover.Description>
                  This is a {emphasis} popover.
                </Popover.Description>
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      ))}
    </div>
  )
}
