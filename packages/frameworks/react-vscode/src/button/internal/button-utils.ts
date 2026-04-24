import type {ButtonSize} from "../button.types"

export function getIconSizeFromButtonSize(buttonSize: ButtonSize): number {
  switch (buttonSize) {
    case "xs":
      return 10
    case "sm":
      return 14
    default:
      return 16
  }
}
