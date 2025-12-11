import {defineEasyType} from "./define-easy-type"

const displayOptions: Intl.DateTimeFormatOptions = {
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  month: "short",
  weekday: "short",
  year: "numeric",
}

export const dateType = defineEasyType<Date>({
  colorKey: "base0D",
  is: (value) => value instanceof Date,
  Renderer: ({value}) => (
    <>{value.toLocaleTimeString("en-us", displayOptions)}</>
  ),
  type: "date",
})
