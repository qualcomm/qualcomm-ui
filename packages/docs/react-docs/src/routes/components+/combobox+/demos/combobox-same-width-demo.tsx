import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {useListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"
import {Combobox} from "@qualcomm-ui/react/combobox"

import {countries} from "./country-list"

export function ComboboxSameWidthDemo() {
  const {contains} = useFilter({sensitivity: "base"})

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
      aria-label="Country"
      className="w-48"
      collection={collection}
      onInputValueChange={handleInputChange}
      placeholder="Select a country"
      positioning={{sameWidth: false}}
    />
    // preview
  )
}
