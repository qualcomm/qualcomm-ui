import type {ReactElement} from "react"

import {Breadcrumbs} from "@qualcomm-ui/react/breadcrumbs"
import {Progress} from "@qualcomm-ui/react/progress"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"
import {Slider} from "@qualcomm-ui/react/slider"
import {Tag} from "@qualcomm-ui/react/tag"

export function Demo(): ReactElement {
  return (
    <div>
      <Breadcrumbs.Root emphasis="brand">
        <Breadcrumbs.List />
      </Breadcrumbs.Root>
      <Progress emphasis="brand" value={50} />
      <Progress.Root emphasis="neutral" value={50} />
      <ProgressRing emphasis={"brand"} />
      <ProgressRing.Root emphasis="brand" />
      <SegmentedControl.Root defaultValue={["chart"]} emphasis="brand">
        <SegmentedControl.Item text="Chart" value="chart" />
      </SegmentedControl.Root>
      <Slider defaultValue={[50]} emphasis="neutral" />
      <Slider.Root emphasis={`brand`} />
      <Tag emphasis="brand-outline" variant="selectable">
        brand
      </Tag>
      <Tag emphasis="neutral-outline">neutral</Tag>
      <Tag emphasis="lime">kiwi</Tag>
      <Tag emphasis="blue" variant="link">
        blue
      </Tag>
    </div>
  )
}
