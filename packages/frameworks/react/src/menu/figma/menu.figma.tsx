// @ts-nocheck

// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"
import {ArrowBigUp, Command, Component} from "lucide-react"

import type {QdsMenuSize} from "@qualcomm-ui/qds-core/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {Icon} from "@qualcomm-ui/react/icon"
import {Menu} from "@qualcomm-ui/react/menu"

const FIGMA_URL = "<FIGMA_COMPONENTS_BASE>?node-id=9054-20157"

const sharedProps = {
  size: figma.enum<QdsMenuSize>("size", {
    sm: "sm",
  }),
}

figma.connect(Menu.Root, FIGMA_URL, {
  example: ({
    checkboxSection,
    checkboxSeparator,
    radioSection,
    radioSeparator,
    size,
  }) => (
    <Menu.Root size={size}>
      <Menu.Trigger>
        <Menu.Button>Open Menu</Menu.Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="item-1">
              <Menu.ItemStartIcon icon={Component} />
              <Menu.ItemLabel>Menu option name</Menu.ItemLabel>
              <Menu.ItemCommand>
                <Icon icon={ArrowBigUp} size="xs" />
                <Icon icon={Command} size="xs" />Z
              </Menu.ItemCommand>
            </Menu.Item>
            <Menu.Item value="item-2">
              <Menu.ItemStartIcon icon={Component} />
              <Menu.ItemLabel>Menu option name</Menu.ItemLabel>
            </Menu.Item>
            <Menu.Item value="item-3">
              <Menu.ItemStartIcon icon={Component} />
              <Menu.ItemLabel>Menu option name</Menu.ItemLabel>
            </Menu.Item>
            <Menu.Root positioning={{gutter: 2, placement: "right-start"}}>
              <Menu.TriggerItem value="item-4">
                <Menu.ItemStartIcon icon={Component} />
                <Menu.ItemLabel>Menu option name</Menu.ItemLabel>
              </Menu.TriggerItem>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>{/* Submenu content */}</Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
            <Menu.Item value="item-5">
              <Menu.ItemStartIcon icon={Component} />
              <Menu.ItemLabel>Menu option name</Menu.ItemLabel>
            </Menu.Item>
            <Menu.CheckboxItem defaultChecked value="item-6">
              <Menu.ItemStartIcon icon={Component} />
              <Menu.ItemLabel>Menu option name</Menu.ItemLabel>
              <Menu.CheckboxItemControl />
            </Menu.CheckboxItem>
            {checkboxSeparator}
            {checkboxSection}
            {radioSeparator}
            {radioSection}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  ),
  props: {
    ...sharedProps,
    checkboxSection: figma.boolean("section2", {
      true: (
        <Menu.ItemGroup>
          <Menu.ItemGroupLabel>Title name</Menu.ItemGroupLabel>
          <Menu.CheckboxItem defaultChecked value="checkbox-1">
            <Menu.CheckboxItemControl />
            <Menu.ItemLabel>Checkbox label</Menu.ItemLabel>
          </Menu.CheckboxItem>
          <Menu.CheckboxItem value="checkbox-2">
            <Menu.CheckboxItemControl />
            <Menu.ItemLabel>Checkbox label</Menu.ItemLabel>
          </Menu.CheckboxItem>
          <Menu.CheckboxItem value="checkbox-3">
            <Menu.CheckboxItemControl />
            <Menu.ItemLabel>Checkbox label</Menu.ItemLabel>
          </Menu.CheckboxItem>
          <Menu.CheckboxItem value="checkbox-4">
            <Menu.CheckboxItemControl />
            <Menu.ItemLabel>Checkbox label</Menu.ItemLabel>
          </Menu.CheckboxItem>
          <Menu.CheckboxItem value="checkbox-5">
            <Menu.CheckboxItemControl />
            <Menu.ItemLabel>Checkbox label</Menu.ItemLabel>
          </Menu.CheckboxItem>
          <Menu.CheckboxItem value="checkbox-6">
            <Menu.CheckboxItemControl />
            <Menu.ItemLabel>Checkbox label</Menu.ItemLabel>
          </Menu.CheckboxItem>
        </Menu.ItemGroup>
      ),
    }),
    checkboxSeparator: figma.boolean("section2", {
      true: <Menu.Separator />,
    }),
    radioSection: figma.boolean("section3", {
      true: (
        <Menu.RadioItemGroup defaultValue="radio-1">
          <Menu.ItemGroupLabel>Title name</Menu.ItemGroupLabel>
          <Menu.RadioItem value="radio-1">
            <Menu.RadioItemControl />
            <Menu.ItemLabel>Radio button label</Menu.ItemLabel>
          </Menu.RadioItem>
          <Menu.RadioItem value="radio-2">
            <Menu.RadioItemControl />
            <Menu.ItemLabel>Radio button label</Menu.ItemLabel>
          </Menu.RadioItem>
          <Menu.RadioItem value="radio-3">
            <Menu.RadioItemControl />
            <Menu.ItemLabel>Radio button label</Menu.ItemLabel>
          </Menu.RadioItem>
          <Menu.RadioItem value="radio-4">
            <Menu.RadioItemControl />
            <Menu.ItemLabel>Radio button label</Menu.ItemLabel>
          </Menu.RadioItem>
          <Menu.RadioItem value="radio-5">
            <Menu.RadioItemControl />
            <Menu.ItemLabel>Radio button label</Menu.ItemLabel>
          </Menu.RadioItem>
          <Menu.RadioItem value="radio-6">
            <Menu.RadioItemControl />
            <Menu.ItemLabel>Radio button label</Menu.ItemLabel>
          </Menu.RadioItem>
        </Menu.RadioItemGroup>
      ),
    }),
    radioSeparator: figma.boolean("section3", {
      true: <Menu.Separator />,
    }),
  },
})
