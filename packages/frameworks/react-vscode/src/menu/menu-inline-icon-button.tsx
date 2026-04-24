import type {ReactElement} from "react"

import {IconButton, type IconButtonProps} from "../icon-button"

export interface MenuInlineIconButtonProps extends IconButtonProps {}

export function MenuInlineIconButton(
  props: MenuInlineIconButtonProps,
): ReactElement {
  return <IconButton {...props} />
}
