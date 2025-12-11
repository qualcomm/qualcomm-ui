import {useJsonViewerStore} from "../../stores"

import {defineEasyType} from "./define-easy-type"

export const nullType = defineEasyType<null>({
  colorKey: "base08",
  displayTypeLabel: false,
  is: (value) => value === null,
  Renderer: () => {
    const backgroundColor = useJsonViewerStore(
      (store) => store.colorspace.base02,
    )
    return (
      <div
        className="q-font-metadata-md-mono rounded-sm px-0.5 py-[1px]"
        style={{
          backgroundColor,
        }}
      >
        NULL
      </div>
    )
  },
  type: "null",
})
