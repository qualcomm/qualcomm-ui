import {type ReactElement, useState} from "react"

import {ChevronLeft, ChevronRight} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"
import {Tab, Tabs} from "@qualcomm-ui/react/tabs"

export function TabsControlledValueDemo(): ReactElement {
  const [value, setValue] = useState<string>("software")

  const goToSoftwareTab = () => setValue("software")
  const goToHardwareTab = () => setValue("hardware")

  return (
    <Tabs.Root onValueChange={setValue} value={value}>
      <Tabs.List>
        <Tabs.Indicator />

        <Tab.Root value="software">
          <Tab.Button>Software</Tab.Button>
        </Tab.Root>
        <Tab.Root value="hardware">
          <Tab.Button>Hardware</Tab.Button>
        </Tab.Root>
      </Tabs.List>
      <Tabs.Panel value="software">
        <div className="flex flex-col gap-4">
          <div>Software Panel</div>
          <Button
            emphasis="primary"
            endIcon={ChevronRight}
            onClick={goToHardwareTab}
            size="sm"
          >
            View Hardware
          </Button>
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="hardware">
        <div className="flex flex-col gap-4">
          <div>Hardware Panel</div>
          <Button
            emphasis="primary"
            onClick={goToSoftwareTab}
            size="sm"
            startIcon={ChevronLeft}
          >
            View Software
          </Button>
        </div>
      </Tabs.Panel>
    </Tabs.Root>
  )
}
