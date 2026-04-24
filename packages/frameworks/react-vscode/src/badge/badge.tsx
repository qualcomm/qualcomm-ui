import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

import type {BadgeSize, BadgeVariant} from "./badge.types"

type DefaultAs = "div"

/**
 * @public
 * @interface
 */
export type BadgeProps<C extends As = DefaultAs> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      /**
       * The component used for the root node. It can be a React component or
       * element.
       *
       * @default 'div'
       */
      as?: C

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
  >

export function Badge<C extends As = DefaultAs>({
  as,
  children,
  className,
  ref,
  size = "sm",
  variant = "primary",
  ...props
}: BadgeProps<C>): ReactElement {
  const Element = as || "div"

  return (
    <Element
      ref={ref}
      className={clsx("vs-badge", variant, className)}
      data-size={size}
      {...props}
    >
      {children}
    </Element>
  )
}
