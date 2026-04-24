import type {ReactNode} from "react"

import {Tab, TabLabel, TabList, TabPanel, Tabs} from "@qualcomm-ui/react-vscode/tabs"

export function TabsShowcaseDemo(): ReactNode {
  return (
    <Tabs defaultValue="problems">
      <TabList>
        <Tab value="problems">
          <TabLabel>PROBLEMS</TabLabel>
        </Tab>
        <Tab value="output">
          <TabLabel>OUTPUT</TabLabel>
        </Tab>
        <Tab disabled value="terminal">
          <TabLabel>TERMINAL</TabLabel>
        </Tab>
        <Tab value="ports">
          <TabLabel>PORTS</TabLabel>
        </Tab>
      </TabList>
      <TabPanel value="problems">Problems panel</TabPanel>
      <TabPanel value="output">Output panel</TabPanel>
      <TabPanel value="terminal">Terminal panel</TabPanel>
      <TabPanel value="ports">Ports panel</TabPanel>
    </Tabs>
  )
}
