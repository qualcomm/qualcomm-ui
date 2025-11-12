import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export default function SliderOriginDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {/* preview */}
      <Slider
        className="sm:w-80"
        defaultValue={[50]}
        label="Start (default)"
        origin="start"
      />
      <Slider
        className="sm:w-80"
        defaultValue={[50]}
        label="Center"
        origin="center"
      />
      <Slider
        className="sm:w-80"
        defaultValue={[50]}
        label="End"
        origin="end"
      />
      {/* preview */}
    </div>
  )
}
