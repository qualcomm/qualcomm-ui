import type {ReactElement} from "react"

import {ChevronLeft, ChevronRight} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"
import {Tab, Tabs} from "@qualcomm-ui/react/tabs"

export function TabsContextDemo(): ReactElement {
  return (
    <Tabs.Root className="w-full" defaultValue="tab-1">
      <Tabs.List>
        <Tabs.Indicator />
        <Tab.Root value="tab-1">
          <Tab.Button>Tab 1</Tab.Button>
        </Tab.Root>
        <Tab.Root value="tab-2">
          <Tab.Button>Tab 2</Tab.Button>
        </Tab.Root>
        <Tab.Root value="tab-3">
          <Tab.Button>Tab 3</Tab.Button>
        </Tab.Root>
      </Tabs.List>
      {/* preview */}
      <Tabs.Context>
        {(context) => (
          <>
            <Tabs.Panel value="tab-1">
              <Button
                endIcon={ChevronRight}
                onClick={() => context.setValue("tab-2")}
                size="sm"
                variant="outline"
              >
                Go to next tab
              </Button>
            </Tabs.Panel>
            <Tabs.Panel className="flex items-center gap-2" value="tab-2">
              <Button
                onClick={() => context.setValue("tab-1")}
                size="sm"
                startIcon={ChevronLeft}
                variant="outline"
              >
                Go to prev tab
              </Button>
              <Button
                endIcon={ChevronRight}
                onClick={() => context.setValue("tab-3")}
                size="sm"
                variant="outline"
              >
                Go to next tab
              </Button>
            </Tabs.Panel>
            <Tabs.Panel value="tab-3">
              <Button
                onClick={() => context.setValue("tab-2")}
                size="sm"
                startIcon={ChevronLeft}
                variant="outline"
              >
                Go to previous tab
              </Button>
            </Tabs.Panel>
          </>
        )}
      </Tabs.Context>
      {/* preview */}
    </Tabs.Root>
  )
}
