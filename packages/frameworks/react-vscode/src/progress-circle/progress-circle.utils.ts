import type {ProgressCircleSize} from "./progress-circle.types"

export function getStrokeWidthFromSize(size: ProgressCircleSize): number {
  switch (size) {
    case "sm":
    case "md":
    case "lg":
      return 7
    default:
      if (size < 48) {
        return 7
      }
      if (size >= 48 && size <= 80) {
        return 6
      }
      return 5
  }
}

export function getPixelSize(size: ProgressCircleSize): string {
  if (typeof size === "number") {
    return `${size}px`
  }
  switch (size) {
    case "sm":
      return "20px"
    case "md":
      return "32px"
    case "lg":
      return "48px"
    default:
      return "32px"
  }
}

export function getStrokeDashOffset(value: number | undefined): number {
  const dashArray = 288.88 // 2 * Math.PI * radius
  if (value != null) {
    return dashArray * ((100 - value) / 100)
  }
  return dashArray
}
