import {type ReactElement, useState} from "react"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {Button} from "@qualcomm-ui/react/button"
import {Menu} from "@qualcomm-ui/react/menu"

const filters = [
  {label: "Project name", value: "project"},
  {label: "Status", value: "status"},
  {label: "Owner", value: "owner"},
  {label: "Team", value: "team"},
  {label: "Region", value: "region"},
  {label: "Start date", value: "start-date"},
  {label: "Due date", value: "due-date"},
  {label: "Last updated", value: "updated"},
]

interface FilterMenuProps {
  label: string
  size: "sm" | "md"
}

function FilterMenu({label, size}: FilterMenuProps): ReactElement {
  const [open, setOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState([
    "project",
    "status",
    "owner",
  ])

  const onCheckedChange = (value: string, checked: boolean) => {
    setSelectedFilters((previous) =>
      checked
        ? [...previous, value]
        : previous.filter((item) => item !== value),
    )
  }

  return (
    <Menu.Root
      closeOnSelect={false}
      onOpenChange={setOpen}
      open={open}
      size={size}
    >
      <Menu.Trigger>
        <Menu.Button emphasis="primary">{label}</Menu.Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          {/* preview */}
          <Menu.Header>
            <Menu.HeaderLabel>
              Applied filters: {selectedFilters.length}
            </Menu.HeaderLabel>
            <Button
              emphasis="primary"
              onClick={() => setSelectedFilters([])}
              type="button"
            >
              Clear all
            </Button>
          </Menu.Header>
          <Menu.Content style={{maxHeight: 200}}>
            {filters.map(({label, value}) => (
              <Menu.CheckboxItem
                key={value}
                checked={selectedFilters.includes(value)}
                onCheckedChange={(checked) => onCheckedChange(value, checked)}
                value={value}
              >
                <Menu.CheckboxItemControl />
                <Menu.ItemLabel>{label}</Menu.ItemLabel>
              </Menu.CheckboxItem>
            ))}
          </Menu.Content>
          <Menu.Footer>
            <Button
              emphasis="neutral"
              onClick={() => setOpen(false)}
              type="button"
              variant="fill"
            >
              Apply Filters
            </Button>
          </Menu.Footer>
          {/* preview */}
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}

export function MenuHeaderFooterDemo(): ReactElement {
  return (
    <div className="flex items-center gap-4">
      <FilterMenu label="Small menu" size="sm" />
      <FilterMenu label="Medium menu" size="md" />
    </div>
  )
}
