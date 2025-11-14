import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"

export default function SegmentedControlDisabledDemo() {
  return (
    // preview
    <SegmentedControl.Root disabled>
      <SegmentedControl.Item text="Chart" value="chart" />
      <SegmentedControl.Item text="Table" value="table" />
      <SegmentedControl.Item text="Map" value="map" />
    </SegmentedControl.Root>
    // preview
  )
}
