import type {ReactElement} from "react"

import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {Button} from "@qualcomm-ui/react/button"
import {Combobox} from "@qualcomm-ui/react/combobox"
import {Popover} from "@qualcomm-ui/react/popover"
import {useListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"

import {countries} from "./country-list"

export default function Demo(): ReactElement {
  const {contains} = useFilter({sensitivity: "base"})

  const {collection, filter} = useListCollection({
    filter: contains,
    initialItems: countries,
  })

  function handleInputChange(details: ComboboxInputValueChangeDetails) {
    filter(details.inputValue)
  }

  return (
    <Popover
      label="Combobox Example"
      trigger={<Button emphasis="primary">Show Popover</Button>}
    >
      <Combobox
        className="w-48"
        collection={collection}
        label="Country"
        onInputValueChange={handleInputChange}
        placeholder="Select a country"
        portalProps={{disabled: true}}
      />
    </Popover>
  )
}
