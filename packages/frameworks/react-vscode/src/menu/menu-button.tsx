import type {ReactElement, ReactNode} from "react"

import {Button, type ButtonProps} from "../button"

export interface MenuButtonProps extends Omit<ButtonProps, "endIcon"> {
  children?: ReactNode
}

export function MenuButton({
  children,
  ...props
}: MenuButtonProps): ReactElement {
  return (
    <Button endIcon="chevron-down" {...props}>
      {children}
    </Button>
  )
}
