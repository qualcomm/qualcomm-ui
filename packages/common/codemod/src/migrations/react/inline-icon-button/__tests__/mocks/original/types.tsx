import type {ComponentProps} from "react"

import type {InlineIconButtonProps} from "@qualcomm-ui/react/inline-icon-button"
import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"

export interface ActionProps extends InlineIconButtonProps {
  label: string
}

export type InlineIconButtonElementProps = ComponentProps<
  typeof InlineIconButton
>
