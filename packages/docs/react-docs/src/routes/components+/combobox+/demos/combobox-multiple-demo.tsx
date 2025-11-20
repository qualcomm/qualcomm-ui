import {useState} from "react"

import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {Combobox} from "@qualcomm-ui/react/combobox"
import {Tag} from "@qualcomm-ui/react/tag"
import {useListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"

import {countries} from "./country-list"

export function ComboboxMultipleDemo() {
  const {contains} = useFilter({sensitivity: "base"})
  const [value, setValue] = useState<string[]>([])

  const {collection, filter} = useListCollection({
    filter: contains,
    initialItems: countries,
  })

  function handleInputChange(details: ComboboxInputValueChangeDetails) {
    filter(details.inputValue)
  }

  function handleValueDismissed(item: string) {
    setValue(value.filter((v) => v !== item))
  }

  return (
    <div className="flex w-72 flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {value.map((item) => (
          <Tag
            key={item}
            emphasis="neutral"
            onClick={() => handleValueDismissed(item)}
            variant="dismissable"
          >
            {item}
          </Tag>
        ))}
      </div>
      <Combobox
        className="w-full"
        collection={collection}
        label="Country"
        multiple
        onInputValueChange={handleInputChange}
        onValueChange={(details) => setValue(details.value)}
        placeholder="Select a country"
        value={value}
      />
    </div>
  )
}
