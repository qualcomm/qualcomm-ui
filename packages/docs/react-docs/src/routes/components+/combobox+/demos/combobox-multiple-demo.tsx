import {useState} from "react"

import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {Combobox} from "@qualcomm-ui/react/combobox"
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

  return (
    <div className="flex flex-col gap-4">
      <Combobox
        className="w-72"
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
