import {type ReactElement, useEffect, useState} from "react"

import {Tab, Tabs} from "@qualcomm-ui/react/tabs"

export function TabsLazyMountedDemo(): ReactElement {
  return (
    <Tabs.Root className="w-80" defaultValue="tab-1" lazyMount unmountOnExit>
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
      <Tabs.Panel value="tab-1">
        <TabContent />
      </Tabs.Panel>
      <Tabs.Panel value="tab-2">
        <TabContent />
      </Tabs.Panel>
      <Tabs.Panel value="tab-3">
        <TabContent />
      </Tabs.Panel>
    </Tabs.Root>
  )
}

function TabContent() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="font-body-sm text-neutral-primary">
      <span>This component has been alive for</span>
      <span className="font-body-sm-bold text-brand-primary">{` ${count} `}</span>
      <span>seconds</span>
    </div>
  )
}
