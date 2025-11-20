import type {ReactElement} from "react"

import {Code, Cpu, FileText, Smartphone} from "lucide-react"

import {Tab, Tabs} from "@qualcomm-ui/react/tabs"

export function TabsDisabledDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <Tabs.Root defaultValue="documents" variant="line">
        <TabContent />
      </Tabs.Root>
      <Tabs.Root variant="contained">
        <TabContent />
      </Tabs.Root>
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
      {/* preview */}
      <Tab.Root disabled value="products">
        <Tab.Button endIcon={Smartphone}>Products</Tab.Button>
      </Tab.Root>
      {/* preview */}
      <Tab.Root value="software">
        <Tab.Button endIcon={Code}>Software</Tab.Button>
      </Tab.Root>
      <Tab.Root value="hardware">
        <Tab.Button endIcon={Cpu}>Hardware</Tab.Button>
      </Tab.Root>
    </Tabs.List>
  )
}
