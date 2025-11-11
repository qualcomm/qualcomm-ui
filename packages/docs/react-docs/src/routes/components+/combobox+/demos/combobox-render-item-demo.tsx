import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {Combobox} from "@qualcomm-ui/react/combobox"
import {useListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"

import {people, type Person} from "./people-list"

export default function Demo() {
  const {contains} = useFilter({sensitivity: "base"})

  const {collection, filter} = useListCollection<Person>({
    filter: contains,
    initialItems: people,
    itemLabel: (item) => `${item.name} ${item.email} ${item.role}`,
    itemValue: (item) => item.id.toString(),
  })

  function handleInputChange(details: ComboboxInputValueChangeDetails) {
    filter(details.inputValue)
  }

  return (
    // preview
    <Combobox
      className="w-72"
      collection={collection}
      label="Select team member"
      onInputValueChange={handleInputChange}
      placeholder="Search by name, role, or email"
      renderItem={({item, ...itemProps}) => {
        const person = item
        return (
          <Combobox.Item className="min-h-[48px]" item={item} {...itemProps}>
            <div className="flex flex-1 flex-col gap-0.5">
              <Combobox.ItemText>
                <span className="font-body-sm">{person.name}</span>
              </Combobox.ItemText>
              <div className="font-body-xs flex items-center gap-1">
                <span>{person.role}</span>
                <span>—</span>
                <span>{person.email}</span>
              </div>
            </div>
            <Combobox.ItemIndicator />
          </Combobox.Item>
        )
      }}
    />
    // preview
  )
}
