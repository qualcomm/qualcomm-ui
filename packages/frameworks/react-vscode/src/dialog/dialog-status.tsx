import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

import {type Codicon, Icon} from "../icon"
import type {StatusVariant} from "../status"

/**
 * @public
 * @interface
 */
export type DialogStatusProps<C extends As = "div"> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      as?: C
      children?: ReactNode

      /**
       * Specifies the codicon name to use. Defaults to the icon for the variant.
       */
      icon?: Codicon

      /**
       * Icon size in pixels.
       *
       * @default 48
       */
      size?: number

      /**
       * The style of the status indicator.
       *
       * @default 'info'
       */
      variant?: StatusVariant
    }
  >

export function DialogStatus<C extends As = "div">({
  as,
  children,
  className,
  icon,
  size,
  variant = "info",
  ...props
}: DialogStatusProps<C>): ReactElement {
  return (
    <Icon<As>
      as={as}
      className={clsx("vs-dialog--status", `vs-status-${variant}`, className)}
      icon={icon || variant}
      size={size || 48}
      {...props}
    >
      {children}
    </Icon>
  )
}
