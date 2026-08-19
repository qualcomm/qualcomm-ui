import {type ReactElement, useState} from "react"

import {listboxCollection} from "@qualcomm-ui/core/listbox"
import {Listbox} from "@qualcomm-ui/react/listbox"

const displayOptions = ["Auto", "Light", "Dark"]
const collection = listboxCollection({items: displayOptions})

export function ListboxControlledStateDemo(): ReactElement {
  const [value, setValue] = useState<string[]>([displayOptions[0]])

  return (
    <div className="w-full max-w-sm">
      {/* preview */}
      <Listbox.Root
        collection={collection}
        onValueChange={({value}) => setValue(value)}
        value={value}
      >
        <Listbox.Label>Appearance</Listbox.Label>
        <Listbox.Content>
          {collection.items.map((item) => (
            <Listbox.Item key={item} item={item}>
              <Listbox.ItemControl />
              <Listbox.ItemLabel>{item}</Listbox.ItemLabel>
            </Listbox.Item>
          ))}
        </Listbox.Content>
      </Listbox.Root>
      <p className="mt-2">Selected: {value.join(", ") || "None"}</p>
      {/* preview */}
    </div>
  )
}
