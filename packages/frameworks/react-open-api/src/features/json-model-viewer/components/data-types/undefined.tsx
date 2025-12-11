import {useJsonViewerStore} from "../../stores"

import {defineEasyType} from "./define-easy-type"

export const undefinedType = defineEasyType<undefined>({
  colorKey: "base05",
  displayTypeLabel: false,
  is: (value) => value === undefined,
  Renderer: () => {
    const backgroundColor = useJsonViewerStore(
      (store) => store.colorspace.base02,
    )
    return (
      <div className="rounded-sm px-0.5 py-[1px]" style={{backgroundColor}}>
        undefined
      </div>
    )
  },
  type: "undefined",
})
