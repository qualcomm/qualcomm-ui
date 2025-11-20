import {useState} from "react"

import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"

export function SegmentedControlControlledDemo() {
  const [value, setValue] = useState<string[] | null | undefined>(null)

  return (
    // preview
    <SegmentedControl.Root
      multiple
      onValueChange={(values) => {
        console.log(`Selected values: ${values?.length ? values : "<none>"}`)
        setValue(values)
      }}
      value={value}
    >
      <SegmentedControl.Item text="Production" value="prod" />
      <SegmentedControl.Item text="Staging" value="staging" />
      <SegmentedControl.Item text="Development" value="dev" />
      <SegmentedControl.Item text="QA" value="qa" />
    </SegmentedControl.Root>
    // preview
  )
}
