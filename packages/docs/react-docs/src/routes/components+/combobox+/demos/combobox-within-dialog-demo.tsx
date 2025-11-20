import type {ReactElement} from "react"

import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {Button} from "@qualcomm-ui/react/button"
import {Combobox} from "@qualcomm-ui/react/combobox"
import {Dialog} from "@qualcomm-ui/react/dialog"
import {useListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"

import {countries} from "./country-list"

export function ComboboxWithinDialogDemo(): ReactElement {
  const {contains} = useFilter({sensitivity: "base"})

  const {collection, filter} = useListCollection({
    filter: contains,
    initialItems: countries,
  })

  function handleInputChange(details: ComboboxInputValueChangeDetails) {
    filter(details.inputValue)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button emphasis="primary" variant="fill">
          Open Dialog
        </Button>
      </Dialog.Trigger>
      <Dialog.FloatingPortal>
        <Dialog.Body>
          <Dialog.Heading>Dialog Title</Dialog.Heading>
          <Dialog.CloseButton />
          <Combobox
            className="w-48"
            collection={collection}
            inputProps={{"aria-label": "Country"}}
            onInputValueChange={handleInputChange}
            placeholder="Select a country"
            portalProps={{disabled: true}}
          />
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button emphasis="primary" size="sm" variant="fill">
              Confirm
            </Button>
          </Dialog.CloseTrigger>
        </Dialog.Footer>
      </Dialog.FloatingPortal>
    </Dialog.Root>
  )
}
