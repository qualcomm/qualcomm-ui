import type {ReactElement} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {Select} from "@qualcomm-ui/react/select"

interface ChipSoftwareProduct {
  name: string
  softwareId: string
  status: "Available" | "Onboarded"
}

const chipSoftwareProducts: ChipSoftwareProduct[] = [
  {
    name: "LINUX.2.0",
    softwareId: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
    status: "Available",
  },
  {
    name: "ANDROID.2.0",
    softwareId: "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
    status: "Available",
  },
  {
    name: "IOT.2.0",
    softwareId: "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b",
    status: "Available",
  },
  {
    name: "CAMERA.2.0",
    softwareId: "b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e",
    status: "Available",
  },
  {
    name: "LINUX.1.0",
    softwareId: "d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a",
    status: "Onboarded",
  },
  {
    name: "ANDROID.1.0",
    softwareId: "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a",
    status: "Onboarded",
  },
  {
    name: "IOT.1.0",
    softwareId: "a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d",
    status: "Onboarded",
  },
  {
    name: "CAMERA.1.0",
    softwareId: "f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c",
    status: "Onboarded",
  },
]

// preview
const collection = selectCollection({
  groupBy: (item) => item.status,
  groupSort: ["Available", "Onboarded"],
  itemDisabled: (item) => item.status === "Onboarded",
  itemLabel: (item) => item.name,
  items: chipSoftwareProducts,
  itemValue: (item) => item.softwareId,
})
// preview

export function SelectItemGroupDemo(): ReactElement {
  return (
    <Select.Root
      className="w-80"
      collection={collection}
      name="chip-software-product"
      placeholder="Select a product"
    >
      <Select.Label>Chip software product</Select.Label>
      <Select.Control>
        <Select.ValueText />
        <Select.ClearTrigger />
        <Select.Indicator />
      </Select.Control>
      <Select.HiddenSelect />
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {collection.group().map(([status, products]) => (
              <Select.ItemGroup key={status}>
                <Select.ItemGroupLabel>{status}</Select.ItemGroupLabel>
                {products.map((product) => (
                  <Select.Item key={product.softwareId} item={product}>
                    <Select.ItemText>{product.name}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.ItemGroup>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}
