import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {Combobox} from "@qualcomm-ui/react/combobox"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {useListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"

import {countries} from "./country-list"

export default function Demo() {
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
      className="w-48"
      collection={collection}
      icon={<ProgressRing size="xs" />}
      inputProps={{"aria-label": "Country"}}
      onInputValueChange={handleInputChange}
      placeholder="Select a country"
    />
    // preview
  )
}
