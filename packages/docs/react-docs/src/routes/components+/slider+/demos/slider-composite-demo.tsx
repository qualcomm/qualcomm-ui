import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export function SliderCompositeDemo(): ReactElement {
  return (
    // preview
    <Slider.Root className="sm:w-[340px]" defaultValue={[25]}>
      <Slider.Label>Choose a value</Slider.Label>
      <Slider.ValueText />
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
      <Slider.Hint>Some contextual help here</Slider.Hint>
      <Slider.Markers />
    </Slider.Root>
    // preview
  )
}
