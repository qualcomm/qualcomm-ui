import {ChartArea, Map, Table} from "lucide-react"

import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"

export default function SegmentedControlIconDemo() {
  return (
    // preview
    <SegmentedControl.Root defaultValue={["chart"]}>
      <SegmentedControl.Item icon={ChartArea} text="Chart" value="chart" />
      <SegmentedControl.Item icon={Table} text="Table" value="table" />
      <SegmentedControl.Item icon={Map} text="Map" value="map" />
    </SegmentedControl.Root>
    // preview
  )
}
