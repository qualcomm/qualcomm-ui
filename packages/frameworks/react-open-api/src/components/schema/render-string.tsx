export interface RenderStringProps {
  value: unknown
}

function valueToString(value: unknown): string {
  if (value === "") {
    return `''`
  }

  if (value === null) {
    return "null"
  }

  if (value === undefined) {
    return "undefined"
  }

  if (typeof value === "string") {
    return value
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  if (Array.isArray(value) || typeof value === "object") {
    return JSON.stringify(value)
  }

  return String(value as string)
}

export function RenderString({value}: RenderStringProps) {
  return <>{valueToString(value)}</>
}
