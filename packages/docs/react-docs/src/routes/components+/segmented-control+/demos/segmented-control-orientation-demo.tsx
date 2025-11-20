import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"

export function SegmentedControlOrientationDemo() {
  return (
    // preview
    <SegmentedControl.Root defaultValue={["chart"]} orientation="vertical">
      <SegmentedControl.Item text="Chart" value="chart" />
      <SegmentedControl.Item text="Table" value="table" />
      <SegmentedControl.Item text="Map" value="map" />
    </SegmentedControl.Root>
    // preview
  )
}
