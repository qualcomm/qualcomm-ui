import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {useListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {Combobox} from "@qualcomm-ui/react/combobox"

interface ChipSoftwareProduct {
  name: string
  softwareId: string
  status?: string
}

const chipSoftwareProducts: ChipSoftwareProduct[] = [
  {
    name: "LINUX.2.0",
    softwareId: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
  },
  {
    name: "ANDROID.2.0",
    softwareId: "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
  },
  {
    name: "IOT.2.0",
    softwareId: "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b",
  },
  {
    name: "CAMERA.2.0",
    softwareId: "b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e",
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

export function ComboboxItemGroupDemo() {
  const {contains} = useFilter({sensitivity: "base"})

  // preview
  const {collection, filter} = useListCollection({
    filter: contains,
    groupBy: (item) => item.status || "",
    groupSort: ["", "Onboarded"],
    initialItems: chipSoftwareProducts,
    itemDisabled: (item) => item.status === "Onboarded",
    itemLabel: (item) => item.name,
    itemValue: (item) => item.softwareId,
  })
  // preview

  function handleInputChange(details: ComboboxInputValueChangeDetails) {
    filter(details.inputValue)
  }

  return (
    <Combobox.Root
      className="w-80"
      collection={collection}
      name="chip-software-product"
      onInputValueChange={handleInputChange}
      placeholder="Select a product"
    >
      <Combobox.Label>Chip software product</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input />
        <Combobox.ClearTrigger />
        <Combobox.Trigger />
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No products found</Combobox.Empty>
            {collection.group().map(([status, products]) => (
              <Combobox.ItemGroup key={status}>
                {status ? (
                  <Combobox.ItemGroupLabel>{status}</Combobox.ItemGroupLabel>
                ) : null}
                {products.map((product) => (
                  <Combobox.Item key={product.softwareId} item={product}>
                    <Combobox.ItemText>{product.name}</Combobox.ItemText>
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                ))}
              </Combobox.ItemGroup>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}
