import type {ReactElement} from "react"

import * as SC from "@qualcomm-ui/react/segmented-control"
import {Slider as QuiSlider} from "@qualcomm-ui/react/slider"

function Slider(props: {variant: string}): ReactElement {
  return <input data-variant={props.variant} type="range" />
}

export function Demo(): ReactElement {
  return (
    <>
      <QuiSlider.Root emphasis="brand" />
      <SC.SegmentedControl.Root emphasis="neutral" />
      <Slider variant="primary" />
    </>
  )
}
