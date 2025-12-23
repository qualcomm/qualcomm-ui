import type {ReactElement} from "react"

import {Button, type ButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSplitButtonContext} from "./qds-split-button-context"

export interface SplitButtonButtonProps
  extends Omit<ButtonProps, "emphasis" | "endIcon" | "size" | "variant"> {}

export function SplitButtonButton(props: SplitButtonButtonProps): ReactElement {
  const qdsContext = useQdsSplitButtonContext()
  const mergedProps = mergeProps(qdsContext.getButtonBindings(), props)
  return <Button {...mergedProps} />
}
