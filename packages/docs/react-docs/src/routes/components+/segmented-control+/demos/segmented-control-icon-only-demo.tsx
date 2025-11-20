import {ChartArea, Map, Table} from "lucide-react"

import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"

export function SegmentedControlIconOnlyDemo() {
  return (
    // preview
    <SegmentedControl.Root defaultValue={["chart"]}>
      <SegmentedControl.Item
        aria-label="Chart view"
        icon={ChartArea}
        value="chart"
      />
      <SegmentedControl.Item
        aria-label="Table view"
        icon={Table}
        value="table"
      />
      <SegmentedControl.Item aria-label="Map view" icon={Map} value="map" />
    </SegmentedControl.Root>
    // preview
  )
}
