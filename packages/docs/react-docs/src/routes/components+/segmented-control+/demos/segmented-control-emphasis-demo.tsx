import type {QdsSegmentedControlEmphasis} from "@qualcomm-ui/qds-core/segmented-control"
import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"

export function SegmentedControlEmphasisDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* preview */}
      {(["brand", "neutral"] as QdsSegmentedControlEmphasis[]).map(
        (emphasis) => (
          <SegmentedControl.Root
            key={emphasis}
            defaultValue={["chart"]}
            emphasis={emphasis}
          >
            <SegmentedControl.Item text="Chart" value="chart" />
            <SegmentedControl.Item text="Table" value="table" />
            <SegmentedControl.Item text="Map" value="map" />
          </SegmentedControl.Root>
        ),
      )}
      {/* preview */}
    </div>
  )
}
