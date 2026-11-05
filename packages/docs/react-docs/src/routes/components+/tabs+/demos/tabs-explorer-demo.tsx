import type {ReactElement} from "react"

import {Tab, Tabs} from "@qualcomm-ui/react/tabs"

export function TabsExplorerDemo(): ReactElement {
  return (
    <Tabs.Root defaultValue="documents">
      <Tabs.List>
        <Tabs.Indicator />
        <Tab.Root value="documents">
          <Tab.Button>Documents</Tab.Button>
          <Tab.DismissButton />
        </Tab.Root>
        <Tab.Root value="products">
          <Tab.Button>Products</Tab.Button>
          <Tab.DismissButton />
        </Tab.Root>
        <Tab.Root value="software">
          <Tab.Button>Software</Tab.Button>
          <Tab.DismissButton />
        </Tab.Root>
      </Tabs.List>
      <Tabs.Panel value="documents">Documents content</Tabs.Panel>
      <Tabs.Panel value="products">Products content</Tabs.Panel>
      <Tabs.Panel value="software">Software content</Tabs.Panel>
    </Tabs.Root>
  )
}
