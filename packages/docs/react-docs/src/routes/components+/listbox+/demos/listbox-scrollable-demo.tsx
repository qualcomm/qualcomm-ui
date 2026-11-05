import type {ReactElement} from "react"

import {listboxCollection} from "@qualcomm-ui/core/listbox"
import {Listbox} from "@qualcomm-ui/react/listbox"

const devices = Array.from(
  {length: 30},
  (_, index) => `Device ${String(index + 1).padStart(3, "0")}`,
)
const collection = listboxCollection({items: devices})

export function ListboxScrollableDemo(): ReactElement {
  return (
    <Listbox.Root
      className="w-full max-w-sm"
      collection={collection}
      selectionMode="single"
    >
      {/* preview */}
      <Listbox.Label>Device</Listbox.Label>
      <Listbox.Content className="max-h-64 overflow-y-auto">
        {collection.items.map((device) => (
          <Listbox.Item key={device} item={device}>
            <Listbox.ItemControl />
            <Listbox.ItemLabel>{device}</Listbox.ItemLabel>
          </Listbox.Item>
        ))}
      </Listbox.Content>
      {/* preview */}
    </Listbox.Root>
  )
}
