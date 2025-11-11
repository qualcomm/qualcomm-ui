import type {ReactElement} from "react"

import {BookCopy} from "lucide-react"

import {quiEcosystem} from "@qualcomm-ui/mdx-docs/qui-ecosystem"
import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Menu, type MenuRootProps} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

const {angular, angularTable, react, reactTable} = quiEcosystem

export interface QuiEcosystemMenuProps extends Partial<MenuRootProps> {}

export function QuiEcosystemMenu(props: QuiEcosystemMenuProps): ReactElement {
  return (
    <Menu.Root {...props}>
      <Menu.Trigger>
        <HeaderBar.MenuItem icon={BookCopy}>QUI Ecosystem</HeaderBar.MenuItem>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {[react, reactTable, angular, angularTable].map((entry) => (
              <Menu.Item
                key={entry.label}
                render={<a href={entry.href} />}
                value="qui-docs"
              >
                <Menu.ItemStartIcon icon={entry.logo} />
                <Menu.ItemLabel>{entry.description}</Menu.ItemLabel>
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
