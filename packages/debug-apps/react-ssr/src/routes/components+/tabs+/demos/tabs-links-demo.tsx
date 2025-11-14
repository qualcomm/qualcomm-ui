import {type ReactElement, useEffect, useState} from "react"

import {useSearchParams} from "react-router"

import {Tab, Tabs} from "@qualcomm-ui/react/tabs"

const tabValues = ["documents", "products", "software", "hardware"]

export default function TabsLinksDemo(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()

  const [value, setValue] = useState<string>(
    searchParams.get("tab") || "documents",
  )

  useEffect(() => {
    // handle back/forward navigation
    const tab = searchParams.get("tab")
    if (tab && tabValues.includes(tab)) {
      setValue(tab)
    }
  }, [searchParams])

  const handleTabChange = (newValue: string) => {
    setValue(newValue)
    setSearchParams({tab: newValue}, {preventScrollReset: true})
  }

  return (
    <Tabs.Root onValueChange={handleTabChange} value={value}>
      <Tabs.List>
        <Tabs.Indicator />
        <Tab.Root value="documents">
          <Tab.Button>Documents</Tab.Button>
        </Tab.Root>
        <Tab.Root value="products">
          <Tab.Button>Products</Tab.Button>
        </Tab.Root>
        <Tab.Root value="software">
          <Tab.Button>Software</Tab.Button>
        </Tab.Root>
        <Tab.Root value="hardware">
          <Tab.Button>Hardware</Tab.Button>
        </Tab.Root>
      </Tabs.List>
      <Tabs.Panel value="documents">Documents</Tabs.Panel>
      <Tabs.Panel value="products">Products</Tabs.Panel>
      <Tabs.Panel value="software">Software</Tabs.Panel>
      <Tabs.Panel value="hardware">Hardware</Tabs.Panel>
    </Tabs.Root>
  )
}
