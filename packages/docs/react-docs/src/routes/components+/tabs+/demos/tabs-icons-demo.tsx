import type {ReactElement} from "react"

import {Code, Cpu, FileText, Smartphone} from "lucide-react"

import {Tab, Tabs} from "@qualcomm-ui/react/tabs"

export default function TabsIconsDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {/* preview */}
      <Tabs.Root>
        <TabContent />
      </Tabs.Root>
      <Tabs.Root iconVariant="filled">
        <TabContent />
      </Tabs.Root>
      <Tabs.Root variant="contained">
        <TabContent />
      </Tabs.Root>
      <Tabs.Root iconVariant="filled" variant="contained">
        <TabContent />
      </Tabs.Root>
      {/* preview */}
    </div>
  )
}

function TabContent() {
  return (
    <Tabs.List>
      <Tabs.Indicator />
      <Tab.Root value="documents">
        <Tab.Button endIcon={FileText}>Documents</Tab.Button>
      </Tab.Root>
      <Tab.Root value="products">
        <Tab.Button endIcon={Smartphone}>Products</Tab.Button>
      </Tab.Root>
      <Tab.Root value="software">
        <Tab.Button endIcon={Code}>Software</Tab.Button>
      </Tab.Root>
      <Tab.Root value="hardware">
        <Tab.Button endIcon={Cpu}>Hardware</Tab.Button>
      </Tab.Root>
    </Tabs.List>
  )
}
