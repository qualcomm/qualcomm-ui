// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {Menu, PanelLeftClose} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import {Drawer, type DrawerRootProps} from "@qualcomm-ui/react/drawer"
import {Icon} from "@qualcomm-ui/react/icon"
import {Portal} from "@qualcomm-ui/react-core/portal"

import {Sidebar} from "./sidebar"
import {useMdxDocsLayoutContext} from "./use-mdx-docs-layout"

export interface MobileSidebarProps extends Omit<DrawerRootProps, "children"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children}
   * prop, displayed as the title of the drawer. Use this to render your
   * application's logo and title.
   */
  children?: ReactNode
}

export function MobileSidebar({
  children,
  ...props
}: MobileSidebarProps): ReactElement {
  const {pathname} = useMdxDocsLayoutContext()

  return (
    <div className="qui-docs-sidebar__mobile-container">
      {/* trigger re-render (and close the drawer) when the route changes */}
      <Drawer.Root key={pathname} placement="start" {...props}>
        <Drawer.Trigger>
          <IconButton
            aria-label="Open Navigation Menu"
            icon={<Icon icon={Menu} size={14} />}
            size="sm"
            variant="ghost"
          />
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content className="qui-docs-sidebar__drawer-content">
              <Drawer.Body className="qui-docs-sidebar__drawer-body">
                <Drawer.Context>
                  {({open, setOpen}) => (
                    <Sidebar
                      data-mobile
                      filterable={false}
                      mobileDrawerState={open}
                      stickyHeader
                    >
                      <>
                        {children}
                        <Drawer.CloseTrigger>
                          <IconButton
                            className="qui-docs-sidebar__mobile-close-trigger"
                            density="compact"
                            icon={PanelLeftClose}
                            onClick={() => setOpen(false)}
                            size="lg"
                            variant="ghost"
                          />
                        </Drawer.CloseTrigger>
                      </>
                    </Sidebar>
                  )}
                </Drawer.Context>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </div>
  )
}
