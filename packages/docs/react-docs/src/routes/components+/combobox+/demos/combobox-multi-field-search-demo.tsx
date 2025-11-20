import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {Combobox} from "@qualcomm-ui/react/combobox"
import {useListCollection} from "@qualcomm-ui/react-core/collection"
import {Portal} from "@qualcomm-ui/react-core/portal"

import {people, type Person} from "./people-list"

export function ComboboxMultiFieldSearchDemo() {
  const {collection, set} = useListCollection({
    initialItems: people,
    itemLabel: (item) => item.name,
    itemValue: (item) => item.id.toString(),
  })

  function handleInputChange(details: ComboboxInputValueChangeDetails) {
    const searchLower = details.inputValue.toLowerCase()

    const filteredItems = people.filter((person) => {
      const nameParts = person.name.toLowerCase().split(" ")
      const emailParts = person.email.toLowerCase().split("@")[0].split(".")

      return (
        person.name.toLowerCase().includes(searchLower) ||
        nameParts.some((part) => part.includes(searchLower)) ||
        emailParts.some((part) => part.includes(searchLower)) ||
        person.role.toLowerCase().includes(searchLower)
      )
    })

    set(filteredItems)
  }

  return (
    // preview
    <Combobox.Root
      className="w-80"
      collection={collection}
      name="person"
      onInputValueChange={handleInputChange}
      placeholder="Search by name, email, or role..."
    >
      <Combobox.Label>Select Person</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input />
        <Combobox.ClearTrigger />
        <Combobox.Trigger />
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No results found</Combobox.Empty>
            {collection.items.map((person: Person) => (
              <Combobox.Item key={person.id} item={person}>
                <div className="flex flex-col gap-0">
                  <span className="text-sm font-medium">{person.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {person.email}
                  </span>
                </div>
                <Combobox.ItemIndicator>✓</Combobox.ItemIndicator>
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
    // preview
  )
}
