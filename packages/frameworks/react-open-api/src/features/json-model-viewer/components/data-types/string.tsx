import {useState} from "react"

import {useJsonViewerStore} from "../../stores"

import {defineEasyType} from "./define-easy-type"

export const stringType = defineEasyType<string>({
  colorKey: "base09",
  deserialize: (value) => value,
  is: (value) => typeof value === "string",
  Renderer: (props) => {
    const [showRest, setShowRest] = useState(false)
    const collapseStringsAfterLength = useJsonViewerStore(
      (store) => store.collapseStringsAfterLength,
    )
    const value = showRest
      ? props.value
      : props.value.slice(0, collapseStringsAfterLength)
    const hasRest = props.value.length > collapseStringsAfterLength
    return (
      <span
        className="data-value"
        onClick={() => {
          if (window.getSelection()?.type === "Range") {
            return
          }

          if (hasRest) {
            setShowRest((value) => !value)
          }
        }}
        style={{
          cursor: hasRest ? "pointer" : "inherit",
        }}
      >
        &quot;
        {value}
        {hasRest && !showRest && <span className="show-rest">…</span>}
        &quot;
      </span>
    )
  },
  serialize: (value) => value,
  type: "string",
})
