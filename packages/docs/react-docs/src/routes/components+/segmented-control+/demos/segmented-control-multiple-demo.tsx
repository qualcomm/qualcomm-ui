import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"

export default function SegmentedControlMultipleDemo() {
  return (
    // preview
    <SegmentedControl.Root multiple>
      <SegmentedControl.Item text="Production" value="prod" />
      <SegmentedControl.Item text="Staging" value="staging" />
      <SegmentedControl.Item text="Development" value="dev" />
      <SegmentedControl.Item text="QA" value="qa" />
    </SegmentedControl.Root>
    // preview
  )
}
