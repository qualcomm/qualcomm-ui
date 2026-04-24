import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

import {type CodiconOrElement, IconOrElement} from "../icon"

/**
 * @public
 * @interface
 */
export type MenuItemProps<C extends As = "button"> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      as?: C
      children: ReactNode
      disabled?: boolean
      endIcon?: CodiconOrElement
      startIcon?: CodiconOrElement
    }
  >

export function MenuItem<C extends As = "button">({
  as,
  children,
  className,
  disabled,
  endIcon,
  startIcon,
  ...props
}: MenuItemProps<C>): ReactElement {
  const Element = as || "button"
  return (
    <Element
      className={clsx("vs-menu-item", className)}
      disabled={disabled}
      role="menuitem"
      {...props}
    >
      {startIcon ? <IconOrElement icon={startIcon} /> : <span />}
      {children}
      {endIcon ? (
        <IconOrElement className="vs-menu-item--end-icon" icon={endIcon} />
      ) : null}
    </Element>
  )
}
