// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Children, isValidElement, type ReactElement} from "react"

import {Tab, Tabs, type TabsRootProps} from "@qualcomm-ui/react/tabs"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface CodeTabsProps extends Partial<TabsRootProps> {}

export function CodeTabs({children, ...props}: CodeTabsProps): ReactElement {
  const tabs = Children.toArray(children).filter(
    (child): child is ReactElement => isValidElement(child),
  )
  const mergedProps = mergeProps({className: "mdx"}, props)
  const firstTab = (tabs[0] as any)?.props?.label

  return (
    <Tabs.Root defaultValue={firstTab} {...mergedProps}>
      <Tabs.List>
        <Tabs.Indicator />
        {tabs.map((tab) => {
          const label = (tab.props as any)?.label
          return (
            <Tab.Root key={label} value={label}>
              <Tab.Button>{(tab.props as any)?.label}</Tab.Button>
            </Tab.Root>
          )
        })}
      </Tabs.List>

      {tabs.map((tab) => {
        const label = (tab.props as any)?.label
        return (
          <Tabs.Panel key={label} value={label}>
            {(tab.props as any)?.children}
          </Tabs.Panel>
        )
      })}
    </Tabs.Root>
  )
}
