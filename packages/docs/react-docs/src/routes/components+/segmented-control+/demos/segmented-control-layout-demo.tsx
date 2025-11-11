import type {QdsSegmentedControlLayout} from "@qualcomm-ui/qds-core/segmented-control"
import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"

export default function SegmentedControlLayoutDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* preview */}
      {(["hug", "fill"] as QdsSegmentedControlLayout[]).map((layout) => (
        <SegmentedControl.Root
          key={layout}
          defaultValue={["chart"]}
          layout={layout}
        >
          <SegmentedControl.Item text="Chart" value="chart" />
          <SegmentedControl.Item text="Table" value="table" />
          <SegmentedControl.Item text="Map" value="map" />
        </SegmentedControl.Root>
      ))}
      {/* preview */}
    </div>
  )
}
