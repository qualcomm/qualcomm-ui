import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"

export function SegmentedControlCompositeDemo() {
  return (
    // preview
    <SegmentedControl.Root defaultValue={["chart"]}>
      <SegmentedControl.ItemRoot value="chart">
        <SegmentedControl.ItemText>Chart</SegmentedControl.ItemText>
        <SegmentedControl.HiddenInput />
      </SegmentedControl.ItemRoot>
      <SegmentedControl.ItemRoot value="table">
        <SegmentedControl.ItemText>Table</SegmentedControl.ItemText>
        <SegmentedControl.HiddenInput />
      </SegmentedControl.ItemRoot>
      <SegmentedControl.ItemRoot value="map">
        <SegmentedControl.ItemText>Map</SegmentedControl.ItemText>
        <SegmentedControl.HiddenInput />
      </SegmentedControl.ItemRoot>
    </SegmentedControl.Root>
    // preview
  )
}
