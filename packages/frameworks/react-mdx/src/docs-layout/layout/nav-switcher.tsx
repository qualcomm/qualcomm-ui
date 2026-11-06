// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {
  type NavSwitcherState,
  useDocsRuntimeContext,
} from "@qualcomm-ui/react-mdx/context"
import {Menu} from "@qualcomm-ui/react/menu"

export interface NavSwitcherProps {
  navSwitcher: NavSwitcherState
}

/**
 * Switches the sidebar between the site's documentation and its OpenAPI
 * references. Entries are links so that they can be opened in a new tab.
 */
export function NavSwitcher({navSwitcher}: NavSwitcherProps): ReactElement {
  const {renderLink: RenderLink} = useDocsRuntimeContext()
  const {active, entries} = navSwitcher

  return (
    <Menu.Root>
      <Menu.Trigger>
        <Menu.Button
          className="qui-docs-sidebar__nav-switcher"
          emphasis="neutral"
          size="sm"
          variant="outline"
        >
          {active.label}
        </Menu.Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {entries.map((entry) => (
              <Menu.Item
                key={entry.pathname}
                aria-current={entry === active ? "page" : undefined}
                render={<RenderLink href={entry.pathname} />}
                value={entry.pathname}
              >
                {entry.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
