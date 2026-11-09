import type {ComponentProps} from "react"

import {type IconButtonProps, IconButton} from "@qualcomm-ui/react/button"

export interface ActionProps extends IconButtonProps {
  label: string
}

export type InlineIconButtonElementProps = ComponentProps<
  typeof IconButton
>
