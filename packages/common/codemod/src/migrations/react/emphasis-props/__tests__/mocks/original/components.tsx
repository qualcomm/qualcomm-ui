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
      <Breadcrumbs.Root emphasis="primary">
        <Breadcrumbs.List />
      </Breadcrumbs.Root>
      <Progress emphasis="primary" value={50} />
      <Progress.Root emphasis="neutral" value={50} />
      <ProgressRing emphasis={"primary"} />
      <ProgressRing.Root emphasis="primary" />
      <SegmentedControl.Root defaultValue={["chart"]} variant="primary">
        <SegmentedControl.Item text="Chart" value="chart" />
      </SegmentedControl.Root>
      <Slider defaultValue={[50]} variant="neutral" />
      <Slider.Root variant={`primary`} />
      <Tag emphasis="outline-brand" variant="selectable">
        brand
      </Tag>
      <Tag emphasis="outline-neutral">neutral</Tag>
      <Tag emphasis="kiwi">kiwi</Tag>
      <Tag emphasis="blue" variant="link">
        blue
      </Tag>
    </div>
  )
}
