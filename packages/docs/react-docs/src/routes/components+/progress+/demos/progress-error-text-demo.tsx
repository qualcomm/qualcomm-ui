import type {ReactElement} from "react"

import {Progress} from "@qualcomm-ui/react/progress"

export function ProgressErrorTextDemo(): ReactElement {
  return (
    // preview
    <Progress
      className="w-64"
      defaultValue={25}
      errorText="Network disconnected, please try again"
      invalid
      label="Loading Module"
      valueText={({valuePercent}) => `${valuePercent}%`}
    />
    // preview
  )
}
