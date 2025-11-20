import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

export function MenuLinksDemo(): ReactElement {
  return (
    <Menu.Root>
      <Menu.Trigger>
        <Menu.Button emphasis="primary">Show Menu</Menu.Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          {/* preview */}
          <Menu.Content>
            <Menu.Item
              render={
                <a href="https://react.dev" rel="noreferrer" target="_blank" />
              }
              value="react"
            >
              <Menu.ItemStartIcon icon={ExternalLink} />
              React
            </Menu.Item>
            <Menu.Item
              render={
                <a
                  href="https://angular.dev"
                  rel="noreferrer"
                  target="_blank"
                />
              }
              value="angular"
            >
              <Menu.ItemStartIcon icon={ExternalLink} />
              Angular
            </Menu.Item>
          </Menu.Content>
          {/* preview */}
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
