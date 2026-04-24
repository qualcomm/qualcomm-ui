import type {ReactNode} from "react"

import {Tab, Tabs} from "@qualcomm-ui/react-vscode/tabs"

export function TabsShowcaseDemo(): ReactNode {
  return (
    <Tabs.Root defaultValue="problems">
      <Tabs.List>
        <Tabs.Indicator />
        <Tab.Root value="problems">
          <Tab.Button>PROBLEMS</Tab.Button>
        </Tab.Root>
        <Tab.Root value="output">
          <Tab.Button>OUTPUT</Tab.Button>
        </Tab.Root>
        <Tab.Root disabled value="terminal">
          <Tab.Button>TERMINAL</Tab.Button>
        </Tab.Root>
        <Tab.Root value="ports">
          <Tab.Button>PORTS</Tab.Button>
        </Tab.Root>
      </Tabs.List>
      <Tabs.Panel value="problems">Problems panel</Tabs.Panel>
      <Tabs.Panel value="output">Output panel</Tabs.Panel>
      <Tabs.Panel value="terminal">Terminal panel</Tabs.Panel>
      <Tabs.Panel value="ports">Ports panel</Tabs.Panel>
    </Tabs.Root>
  )
}
