import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {Combobox} from "@qualcomm-ui/react/combobox"
import {useListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"

const cityList = ["San Diego", "Dallas", "Denver"]

export default function Demo() {
  const {contains} = useFilter({sensitivity: "base"})

  const {collection, filter} = useListCollection({
    filter: contains,
    initialItems: cityList,
  })

  function handleInputChange(details: ComboboxInputValueChangeDetails) {
    filter(details.inputValue)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Combobox
        className="w-40"
        collection={collection}
        inputProps={{"aria-label": "City"}}
        onInputValueChange={handleInputChange}
        placeholder="sm"
        positioning={{sameWidth: true}}
        size="sm"
      />
      <Combobox
        className="w-48"
        collection={collection}
        inputProps={{"aria-label": "City"}}
        onInputValueChange={handleInputChange}
        placeholder="md"
        positioning={{sameWidth: true}}
        size="md"
      />
      <Combobox
        className="w-56"
        collection={collection}
        inputProps={{"aria-label": "City"}}
        onInputValueChange={handleInputChange}
        placeholder="lg"
        positioning={{sameWidth: true}}
        size="lg"
      />
    </div>
  )
}
