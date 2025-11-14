import {useState} from "react"

import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {Combobox} from "@qualcomm-ui/react/combobox"
import {useListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"

import {countries} from "./country-list"

export default function Demo() {
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
    // preview
    <Combobox
      className="w-48"
      collection={collection}
      errorText="You must select a country"
      inputProps={{"aria-label": "Country"}}
      invalid={!value.length}
      onInputValueChange={handleInputChange}
      onValueChange={(details) => setValue(details.value)}
      placeholder="Select a country"
      value={value}
    />
    // preview
  )
}
