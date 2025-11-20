import type {QdsSegmentedControlSize} from "@qualcomm-ui/qds-core/segmented-control"
import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"

export function SegmentedControlSizeDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* preview */}
      {(["sm", "md", "lg"] as QdsSegmentedControlSize[]).map((size) => (
        <SegmentedControl.Root key={size} defaultValue={["chart"]} size={size}>
          <SegmentedControl.Item text="Chart" value="chart" />
          <SegmentedControl.Item text="Table" value="table" />
          <SegmentedControl.Item text="Map" value="map" />
        </SegmentedControl.Root>
      ))}
      {/* preview */}
    </div>
  )
}
