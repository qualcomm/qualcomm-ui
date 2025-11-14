import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {Drawer} from "@qualcomm-ui/react/drawer"
import {LoremIpsum} from "@qualcomm-ui/react-core/lorem-ipsum"

export default function DrawerPlacementDemo(): ReactElement {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button emphasis="primary" variant="fill">
          Open Drawer
        </Button>
      </Drawer.Trigger>
      <Drawer.FloatingPortal>
        <Drawer.Body>
          <Drawer.Heading>Drawer Title</Drawer.Heading>
          <Drawer.CloseButton />
          <Drawer.Description>
            <LoremIpsum />
          </Drawer.Description>
        </Drawer.Body>

        <Drawer.Footer>
          <Drawer.CloseTrigger>
            <Button emphasis="primary" size="sm" variant="fill">
              Confirm
            </Button>
          </Drawer.CloseTrigger>
        </Drawer.Footer>
      </Drawer.FloatingPortal>
    </Drawer.Root>
  )
}
