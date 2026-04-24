import type {HTMLAttributes, ReactNode} from "react"

import {Icon} from "./icon"
import type {CodiconOrElement} from "./icon.types"

export interface IconOrElementProps extends HTMLAttributes<HTMLSpanElement> {
  icon: CodiconOrElement

  /**
   * Icon size in pixels. Only applies when the icon is supplied as a Codicon string.
   *
   * @default 16
   */
  size?: number

  /**
   * Skips the element wrapper and prop forwarding to the {@link icon} when it is
   * supplied as a `ReactElement`.
   */
  skipElementWrapper?: boolean
}

export function IconOrElement({
  icon,
  size,
  skipElementWrapper,
  ...props
}: IconOrElementProps): ReactNode {
  if (typeof icon === "string") {
    return <Icon icon={icon} size={size} {...props} />
  }

  if (skipElementWrapper) {
    return icon
  }

  return <span {...props}>{icon}</span>
}
