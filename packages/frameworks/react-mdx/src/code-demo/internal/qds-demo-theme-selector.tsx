// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {Menu} from "@qualcomm-ui/react/menu"
import type {QdsBrand} from "@qualcomm-ui/react/qds-theme"

import {themeOptCollection} from "./use-qds-demo-theme.js"

export interface QdsDemoThemeSelectorProps {
  qdsBrand: QdsBrand
  setQdsBrand: (brand: QdsBrand) => void
}

export function QdsDemoThemeSelector({
  qdsBrand,
  setQdsBrand,
}: QdsDemoThemeSelectorProps): ReactElement {
  const currentLabel =
    themeOptCollection.find(qdsBrand)?.label ?? themeOptCollection.at(0)!.label

  return (
    <div className="qui-demo-runner__brand-selection-wrapper">
      <Menu.Root size="sm">
        <Menu.Trigger>
          <Menu.Button emphasis="neutral" size="sm" variant="ghost">
            {currentLabel}
          </Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel>Brand</Menu.ItemGroupLabel>
                {themeOptCollection.items.map((item) => (
                  <Menu.CheckboxItem
                    key={item.id}
                    checked={qdsBrand === item.id}
                    onCheckedChange={() => setQdsBrand(item.id)}
                    value={item.id}
                  >
                    <Menu.ItemLabel>{item.label}</Menu.ItemLabel>
                    <Menu.ItemIndicator />
                  </Menu.CheckboxItem>
                ))}
              </Menu.ItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </div>
  )
}
