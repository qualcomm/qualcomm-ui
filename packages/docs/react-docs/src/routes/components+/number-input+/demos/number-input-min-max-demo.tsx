import type {ReactElement} from "react"

import {NumberInput} from "@qualcomm-ui/react/number-input"

export default function NumberInputMinMaxDemo(): ReactElement {
  return (
    // preview
    <NumberInput className="w-72" defaultValue="5" max={10} min={5} />
    // preview
  )
}
