import {type ReactElement, useState} from "react"

import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

const items: {label: string; value: string}[] = [
  {label: "Option 1", value: "item-1"},
  {label: "Option 2", value: "item-2"},
  {label: "Option 3", value: "item-3"},
]

export default function MenuCheckboxSelectionStateDemo(): ReactElement {
  const [checkboxState, setCheckboxState] = useState<Record<string, boolean>>({
    [items[0].value]: true,
  })

  const onChange = (value: string, checked: boolean) => {
    setCheckboxState((prevState) => ({...prevState, [value]: checked}))
  }

  return (
    <Menu.Root>
      <Menu.Trigger>
        <Menu.Button emphasis="primary">Show Menu</Menu.Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {/* preview */}
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Choose an option</Menu.ItemGroupLabel>
              {items.map(({label, value}) => (
                <Menu.CheckboxItem
                  key={value}
                  checked={checkboxState[value] || false}
                  onCheckedChange={(checked) => onChange(value, checked)}
                  value={value}
                >
                  <Menu.ItemLabel>{label}</Menu.ItemLabel>
                  <Menu.ItemIndicator />
                </Menu.CheckboxItem>
              ))}
            </Menu.ItemGroup>
            {/* preview */}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
