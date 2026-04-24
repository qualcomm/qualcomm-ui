import type {ReactElement, ReactNode} from "react"

import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {type Codicon, Icon} from "../icon"
import type {StatusVariant} from "../status"

/**
 * @public
 */
export interface DialogIndicatorIconProps extends ElementRenderProp<"div"> {
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

/**
 * An icon that indicates the dialog's status. Renders a `<div>` element by
 * default.
 */
export function DialogIndicatorIcon({
  children,
  icon,
  size,
  variant = "info",
  ...props
}: DialogIndicatorIconProps): ReactElement {
  const mergedProps = mergeProps(
    {className: "vs-dialog__indicator-icon"},
    {className: `vs-status-${variant}`},
    props,
  )

  return (
    <Icon
      icon={icon || variant}
      render={<div />}
      size={size || 48}
      {...mergedProps}
    >
      {children}
    </Icon>
  )
}
