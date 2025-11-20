import type {QdsSegmentedControlVariant} from "@qualcomm-ui/qds-core/segmented-control"
import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"

export function SegmentedControlVariantDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* preview */}
      {(["primary", "neutral"] as QdsSegmentedControlVariant[]).map(
        (variant) => (
          <SegmentedControl.Root
            key={variant}
            defaultValue={["chart"]}
            variant={variant}
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
