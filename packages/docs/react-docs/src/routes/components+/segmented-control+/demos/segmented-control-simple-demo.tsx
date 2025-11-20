import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"

export function SegmentedControlSimpleDemo() {
  return (
    // preview
    <SegmentedControl.Root defaultValue={["chart"]}>
      <SegmentedControl.Item text="Chart" value="chart" />
      <SegmentedControl.Item text="Table" value="table" />
      <SegmentedControl.Item text="Map" value="map" />
    </SegmentedControl.Root>
    // preview
  )
}
