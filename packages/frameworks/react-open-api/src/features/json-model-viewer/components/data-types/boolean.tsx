import {defineEasyType} from "./define-easy-type"

export const booleanType = defineEasyType<boolean>({
  colorKey: "base0E",
  deserialize: (value) => {
    if (value === "true") {
      return true
    }
    if (value === "false") {
      return false
    }
    throw new Error("Invalid boolean value")
  },
  is: (value) => typeof value === "boolean",
  Renderer: ({value}) => <>{value ? "true" : "false"}</>,
  serialize: (value) => value.toString(),
  type: "bool",
})
