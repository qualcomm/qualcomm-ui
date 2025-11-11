import {type ReactElement, useRef} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {Drawer} from "@qualcomm-ui/react/drawer"
import {Portal} from "@qualcomm-ui/react-core/portal"

export default function DrawerCustomContainerDemo(): ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="grid gap-4">
      <Drawer.Root
        closeOnEscape={false}
        closeOnInteractOutside={false}
        preventScroll={false}
        trapFocus={false}
      >
        <div
          ref={containerRef}
          className="border-neutral-03 relative flex h-96 w-[600px] overflow-hidden border p-8"
        >
          <Drawer.Trigger>
            <Button emphasis="primary" variant="fill">
              Open Drawer
            </Button>
          </Drawer.Trigger>
        </div>

        <Portal container={containerRef}>
          <Drawer.Positioner className="absolute z-0 h-full w-full">
            <Drawer.Content>
              <Drawer.Body>
                <Drawer.Heading>Title</Drawer.Heading>
                <Drawer.CloseButton />
                <Drawer.Description>Description</Drawer.Description>
              </Drawer.Body>

              <Drawer.Footer>
                <Drawer.CloseTrigger>
                  <Button emphasis="primary" size="sm" variant="fill">
                    Confirm
                  </Button>
                </Drawer.CloseTrigger>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </div>
  )
}
