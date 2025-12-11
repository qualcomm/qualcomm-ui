import {defineEasyType} from "./define-easy-type"

export const booleanSchemaType = defineEasyType<string>({
  colorKey: "base09",
  is: (value: unknown) =>
    !!(
      value &&
      typeof value === "object" &&
      "type" in value &&
      value.type === "boolean"
    ),
  Renderer: () => {
    return <span className="data-value">boolean</span>
  },
  type: "boolean",
})
