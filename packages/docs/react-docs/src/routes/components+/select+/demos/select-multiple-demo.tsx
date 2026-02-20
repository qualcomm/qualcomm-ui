import type {ReactElement} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Select} from "@qualcomm-ui/react/select"

const cityCollection = selectCollection({
  items: [
    "San",
    "Nas",
    "Den",
    "Mia",
    "I",
    "0",
    "i",
    ",",
    ".",
    "fdfdsfdsgdgfllkjhljkhgdfsgsdflgjdfhslkghdfslgjkhdslkgjhdlsfkgjhdlfskjghdsflkhgdflk",
  ],
})

export function SelectMultipleDemo(): ReactElement {
  return (
    // preview
    <Select
      className="w-72"
      collection={cityCollection}
      controlProps={{"aria-label": "City"}}
      maxTagCount="responsive"
      multiple
      placeholder="Select cities"
      selectionIndicator="checkbox"
    />
    // preview
  )
}
