import type {ReactElement} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Select} from "@qualcomm-ui/react/select"
import {Portal} from "@qualcomm-ui/react-core/portal"

const cityCollection = selectCollection({
  items: [
    "San Diego",
    "Nashville",
    "Denver",
    "Miami",
    "Las Vegas",
    "New York City",
    "San Francisco",
  ],
})

export function SelectCompositeDemo(): ReactElement {
  return (
    // preview
    <Select.Root
      className="w-48"
      collection={cityCollection}
      placeholder="Select a city"
    >
      <Select.Label>City</Select.Label>

      <Select.Control>
        <Select.ValueText />
        <Select.ClearTrigger />
        <Select.Indicator />
        <Select.ErrorIndicator />
      </Select.Control>

      <Select.HiddenSelect />

      <Portal>
        <Select.Positioner>
          <Select.Content>
            {cityCollection.items.map((item) => {
              const label = cityCollection.stringifyItem(item)
              const value = cityCollection.getItemValue(item)
              return (
                <Select.Item key={value} item={item}>
                  <Select.ItemText>{label}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              )
            })}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
    // preview
  )
}
