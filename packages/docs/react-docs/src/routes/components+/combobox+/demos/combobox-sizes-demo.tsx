import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {useListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"
import {Combobox} from "@qualcomm-ui/react/combobox"

const cityList = ["San Diego", "Dallas", "Denver"]

export function ComboboxSizesDemo() {
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
        aria-label="City"
        className="w-40"
        collection={collection}
        onInputValueChange={handleInputChange}
        placeholder="sm"
        positioning={{sameWidth: true}}
        size="sm"
      />
      <Combobox
        aria-label="City"
        className="w-48"
        collection={collection}
        onInputValueChange={handleInputChange}
        placeholder="md"
        positioning={{sameWidth: true}}
        size="md"
      />
      <Combobox
        aria-label="City"
        className="w-56"
        collection={collection}
        onInputValueChange={handleInputChange}
        placeholder="lg"
        positioning={{sameWidth: true}}
        size="lg"
      />
    </div>
  )
}
