import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import type {BadgeSize, BadgeVariant} from "./badge.types"

export interface BadgeProps extends ElementRenderProp<"div"> {
  /**
   * Text content of the badge.
   */
  children?: ReactNode

  /**
   * Size of the badge.
   */
  size?: BadgeSize

  /**
   * The style variant of the badge.
   */
  variant?: BadgeVariant
}

export function Badge({
  children,
  size = "sm",
  variant = "primary",
  ...props
}: BadgeProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-badge__root"}, props)

  return (
    <PolymorphicElement
      as="div"
      data-size={size}
      data-variant={variant}
      {...mergedProps}
    >
      {children}
    </PolymorphicElement>
  )
}
