import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {Combobox} from "@qualcomm-ui/react/combobox"
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
    <div className="flex w-60 flex-col gap-4">
      {/* preview */}
      <Combobox
        className="w-48"
        collection={collection}
        defaultValue={[countries[0]]}
        disabled
        label="Disabled"
        onInputValueChange={handleInputChange}
      />
      <Combobox
        className="w-48"
        collection={collection}
        defaultValue={[countries[0]]}
        label="Read only"
        onInputValueChange={handleInputChange}
        readOnly
      />
      <Combobox
        className="w-48"
        collection={collection}
        defaultValue={[countries[0]]}
        errorText="Invalid"
        invalid
        label="Invalid"
        onInputValueChange={handleInputChange}
      />
      {/* preview */}
    </div>
  )
}
