import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export function SliderTooltipDisplayDemo(): ReactElement {
  return (
    <Slider.Root className="mt-3 sm:w-80" defaultValue={[25, 65]}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0}>
          <Slider.HiddenInput />
          <Slider.ThumbIndicator display={(value) => `From ${value}%`} />
        </Slider.Thumb>
        <Slider.Thumb index={1}>
          <Slider.HiddenInput />
          <Slider.ThumbIndicator display={(value) => `To ${value}%`} />
        </Slider.Thumb>
      </Slider.Control>
      <Slider.Markers />
    </Slider.Root>
  )
}
