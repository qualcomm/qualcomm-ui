import type {ReactElement} from "react"

import * as SC from "@qualcomm-ui/react/segmented-control"
import {Slider as QuiSlider} from "@qualcomm-ui/react/slider"

function Slider(props: {variant: string}): ReactElement {
  return <input data-variant={props.variant} type="range" />
}

export function Demo(): ReactElement {
  return (
    <>
      <QuiSlider.Root variant="primary" />
      <SC.SegmentedControl.Root variant="neutral" />
      <Slider variant="primary" />
    </>
  )
}
