import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {Combobox} from "@qualcomm-ui/react/combobox"
import {useListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"

import {countries} from "./country-list"

export function ComboboxInputBehaviorDemo() {
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
      collection={collection}
      inputBehavior="autohighlight"
      label="Country"
      onInputValueChange={handleInputChange}
      placeholder="Select a country"
    />
    // preview
  )
}
