import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {Collapsible} from "@qualcomm-ui/react/collapsible"

export default function CollapsibleShowcaseDemo(): ReactElement {
  return (
    <Collapsible.Root className="flex flex-col items-center">
      <Collapsible.Trigger
        className="my-3"
        render={<Button emphasis="primary" />}
      >
        Toggle
      </Collapsible.Trigger>
      <Collapsible.Content>
        <div className="border-neutral-01 flex h-48 w-72 flex-col rounded-sm border p-4">
          Content
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
