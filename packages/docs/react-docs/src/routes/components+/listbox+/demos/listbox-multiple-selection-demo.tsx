import type {ReactElement} from "react"

import {listboxCollection} from "@qualcomm-ui/core/listbox"
import {Listbox} from "@qualcomm-ui/react/listbox"

interface Reviewer {
  description: string
  label: string
  value: string
}

const reviewers: Reviewer[] = [
  {
    description: "Product design",
    label: "Avery Chen",
    value: "avery-chen",
  },
  {
    description: "Frontend engineering",
    label: "Jordan Lee",
    value: "jordan-lee",
  },
  {
    description: "Accessibility",
    label: "Morgan Patel",
    value: "morgan-patel",
  },
  {
    description: "Quality engineering",
    label: "Riley Kim",
    value: "riley-kim",
  },
  {
    description: "Developer experience",
    label: "Taylor Nguyen",
    value: "taylor-nguyen",
  },
  {
    description: "Release engineering",
    label: "Casey Wright",
    value: "casey-wright",
  },
]

const collection = listboxCollection({items: reviewers})

export function ListboxMultipleSelectionDemo(): ReactElement {
  return (
    <div className="w-full max-w-sm">
      {/* preview */}
      <Listbox.Root collection={collection} selectionMode="multiple">
        <Listbox.Label>Assign reviewers</Listbox.Label>
        <Listbox.Content>
          {collection.items.map((reviewer) => (
            <Listbox.Item key={reviewer.value} item={reviewer}>
              <Listbox.ItemControl />
              <Listbox.ItemLabel>{reviewer.label}</Listbox.ItemLabel>
              <Listbox.ItemDescription>
                {reviewer.description}
              </Listbox.ItemDescription>
            </Listbox.Item>
          ))}
        </Listbox.Content>
      </Listbox.Root>
      {/* preview */}
    </div>
  )
}
