import type {ReactNode} from "react"

import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {Icon} from "../icon"

import type {StatusVariant} from "./status.types"

export interface StatusProps extends ElementRenderProp<"div"> {
  /**
   * Size of the status component
   *
   * @default 16
   */
  size?: number

  /**
   * The status's primary message.
   *
   * @default 'info
   */
  variant?: StatusVariant
}

export function Status({
  size,
  variant = "info",
  ...props
}: StatusProps): ReactNode {
  const mergedProps = mergeProps({className: `vs-status-${variant}`}, props)

  return (
    <Icon icon={variant} render={<div />} size={size || 16} {...mergedProps} />
  )
}
