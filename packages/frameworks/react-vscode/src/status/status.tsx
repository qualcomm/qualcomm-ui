import type {ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

import {Icon} from "../icon"

import type {StatusVariant} from "./status.types"

/**
 * @public
 * @interface
 */
export type StatusProps<C extends As = "div"> =
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
  >

export function Status<C extends As>({
  as,
  className,
  size,
  variant = "info",
  ...props
}: StatusProps<C>): ReactNode {
  return (
    <Icon<As>
      as={as}
      className={clsx(`vs-status-${variant}`, className)}
      icon={variant}
      size={size || 16}
      {...props}
    />
  )
}
