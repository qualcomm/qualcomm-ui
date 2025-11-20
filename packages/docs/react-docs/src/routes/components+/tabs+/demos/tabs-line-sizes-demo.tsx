import type {ReactElement} from "react"

import {Code, Cpu, FileText, Smartphone} from "lucide-react"

import type {QdsTabsSize} from "@qualcomm-ui/qds-core/tabs"
import {Tab, Tabs} from "@qualcomm-ui/react/tabs"

const sizes: QdsTabsSize[] = ["sm", "md", "lg", "xl"]

export function TabsLineSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex items-center gap-4">
          <div className="font-heading-xs text-neutral-primary w-16">
            {size}
          </div>
          <Tabs.Root defaultValue="documents" size={size}>
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
          </Tabs.Root>
        </div>
      ))}
    </div>
  )
}
