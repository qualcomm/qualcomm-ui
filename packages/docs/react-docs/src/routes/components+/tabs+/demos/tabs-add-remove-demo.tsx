import {type ReactElement, type ReactNode, useState} from "react"

import {Plus} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"
import {Tab, Tabs} from "@qualcomm-ui/react/tabs"
import {LoremIpsum} from "@qualcomm-ui/react-core/lorem-ipsum"

interface Item {
  content: ReactNode
  id: string
  title: string
}

const items: Item[] = [
  {content: "Tab Content", id: "1", title: "Tab"},
  {content: "Tab Content", id: "2", title: "Tab"},
  {content: "Tab Content", id: "3", title: "Tab"},
  {content: "Tab Content", id: "4", title: "Tab"},
]

export function TabsAddRemoveDemo(): ReactElement {
  const [tabs, setTabs] = useState<Item[]>(items)
  const [selectedTab, setSelectedTab] = useState<string | null>(items[0].id)

  const addTab = () => {
    const newTabs = [...tabs]

    newTabs.push({
      content: `Tab Body`,
      id: `${parseInt(tabs[newTabs.length - 1]?.id ?? "0") + 1}`,
      title: `Tab`,
    })

    setTabs(newTabs)
    setSelectedTab(newTabs[newTabs.length - 1].id)
  }

  const removeTab = (id: string) => {
    if (tabs.length > 1) {
      const newTabs = [...tabs].filter((tab) => tab.id !== id)
      setTabs(newTabs)
      if (selectedTab === id) {
        setSelectedTab(newTabs[0].id)
      }
    }
  }

  return (
    <Tabs.Root onValueChange={setSelectedTab} size="sm" value={selectedTab}>
      <Tabs.List>
        <Tabs.Indicator />
        {tabs.map((item) => (
          <Tab.Root key={item.id} value={item.id}>
            <Tab.Button>
              {item.title} {item.id}
            </Tab.Button>
            <Tab.DismissButton onClick={() => removeTab(item.id)} />
          </Tab.Root>
        ))}
        <Button onClick={addTab} size="sm" startIcon={Plus} variant="ghost">
          Add Tab
        </Button>
      </Tabs.List>

      {tabs.map((item) => (
        <Tabs.Panel key={item.id} value={item.id}>
          <div className="font-heading-xs text-neutral-primary my-6">
            {item.content} {item.id}
          </div>
          <div className="font-body-sm text-neutral-primary">
            <LoremIpsum />
          </div>
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  )
}
