import type {ReactElement} from "react"

import {ChevronDown} from "lucide-react"

import {IconButton, type IconButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSplitButtonContext} from "./qds-split-button-context"

export interface SplitButtonIconButtonProps
  extends Omit<
    IconButtonProps,
    "density" | "emphasis" | "icon" | "size" | "variant"
  > {}

export function SplitButtonIconButton(
  props: SplitButtonIconButtonProps,
): ReactElement {
  const qdsContext = useQdsSplitButtonContext()
  const mergedProps = mergeProps(qdsContext.getIconButtonBindings(), props)
  return <IconButton icon={ChevronDown} {...mergedProps} />
}
