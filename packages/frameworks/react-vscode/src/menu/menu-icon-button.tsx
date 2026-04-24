import type {ReactElement} from "react"

import {IconButton, type IconButtonProps} from "../icon-button"

export interface MenuIconButtonProps extends Omit<IconButtonProps, "icon"> {
  /**
   * VSCode codicon name or JSX Element. When omitted, the chevron indicator is
   * used.
   */
  icon?: IconButtonProps["icon"]
}

export function MenuIconButton({
  icon = "chevron-down",
  ...props
}: MenuIconButtonProps): ReactElement {
  return <IconButton icon={icon} {...props} />
}
