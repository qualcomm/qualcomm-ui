// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"
import {Menu} from "@qualcomm-ui/react/menu"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface DemoStyleToggleProps extends ComponentPropsWithRef<"div"> {
  onValueChange: (value: "inline" | "tailwind") => void
}

export function DemoStyleToggle({
  onValueChange,
  ...props
}: DemoStyleToggleProps): ReactElement {
  const {demoSettings} = useMdxDocsContext()

  const currentValue = demoSettings?.transformTailwindClasses
    ? "inline"
    : "tailwind"

  const mergedProps = mergeProps(
    {className: "qui-demo-runner__style-toggle"},
    props,
  )

  return (
    <div {...mergedProps}>
      <Menu.Root size="sm">
        <Menu.Trigger>
          <Menu.Button emphasis="neutral" size="sm" variant="ghost">
            {currentValue === "inline" ? "Inline Styles" : "Tailwind CSS"}
          </Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel>Style Syntax</Menu.ItemGroupLabel>
                <Menu.CheckboxItem
                  checked={currentValue === "tailwind"}
                  onCheckedChange={() => onValueChange("tailwind")}
                  value="tailwind"
                >
                  <Menu.ItemLabel>Tailwind CSS</Menu.ItemLabel>
                  <Menu.ItemIndicator />
                </Menu.CheckboxItem>
                <Menu.CheckboxItem
                  checked={currentValue === "inline"}
                  onCheckedChange={() => onValueChange("inline")}
                  value="inline"
                >
                  <Menu.ItemLabel>Inline Styles</Menu.ItemLabel>
                  <Menu.ItemIndicator />
                </Menu.CheckboxItem>
              </Menu.ItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </div>
  )
}
