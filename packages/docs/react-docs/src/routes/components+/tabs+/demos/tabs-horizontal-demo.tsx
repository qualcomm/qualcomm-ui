import type {ReactElement} from "react"

import {Tab, Tabs} from "@qualcomm-ui/react/tabs"

export function TabsHorizontalDemo(): ReactElement {
  return (
    <Tabs.Root defaultValue="documents">
      <Tabs.List>
        <Tabs.Indicator />
        <Tab.Root value="documents">
          <Tab.Button>Documents</Tab.Button>
        </Tab.Root>
        <Tab.Root value="products">
          <Tab.Button>Products</Tab.Button>
        </Tab.Root>
        <Tab.Root value="software">
          <Tab.Button>Software</Tab.Button>
        </Tab.Root>
        <Tab.Root value="hardware">
          <Tab.Button>Hardware</Tab.Button>
        </Tab.Root>
      </Tabs.List>
      <Tabs.Panel value="documents">Documents</Tabs.Panel>
      <Tabs.Panel value="products">Products</Tabs.Panel>
      <Tabs.Panel value="software">Software</Tabs.Panel>
      <Tabs.Panel value="hardware">Hardware</Tabs.Panel>
    </Tabs.Root>
  )
}
