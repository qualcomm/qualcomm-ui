import type {ReactElement, ReactNode} from "react"

import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {type CodiconOrElement, IconOrElement} from "../icon"

export interface MenuItemStartIconProps extends Omit<
  ElementRenderProp<"span">,
  "icon"
> {
  children?: ReactNode

  /**
   * VSCode codicon name or JSX Element.
   */
  icon: CodiconOrElement
}

export function MenuItemStartIcon({
  icon,
  ...props
}: MenuItemStartIconProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-menu-item__start-icon"}, props)

  return <IconOrElement icon={icon} {...mergedProps} />
}
