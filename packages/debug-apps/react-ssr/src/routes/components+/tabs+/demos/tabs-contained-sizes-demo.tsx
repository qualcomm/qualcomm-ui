import type {ReactElement} from "react"

import {Code, Cpu, FileText, Smartphone} from "lucide-react"

import type {QdsTabsSize} from "@qualcomm-ui/qds-core/tabs"
import {Tab, Tabs} from "@qualcomm-ui/react/tabs"

const sizes: QdsTabsSize[] = ["sm", "md"]

export default function TabsContainedSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {sizes.map((size) => (
        <Tabs.Root
          key={size}
          defaultValue="documents"
          size={size}
          variant="contained"
        >
          <Tabs.List>
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
        </Tabs.Root>
      ))}
    </div>
  )
}
