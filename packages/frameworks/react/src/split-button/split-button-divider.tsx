import type {ComponentPropsWithRef, ReactElement} from "react"

import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSplitButtonContext} from "./qds-split-button-context"

export interface SplitButtonDividerProps
  extends Omit<ComponentPropsWithRef<"div">, "children"> {}

export function SplitButtonDivider(
  props: SplitButtonDividerProps,
): ReactElement {
  const qdsContext = useQdsSplitButtonContext()
  const mergedProps = mergeProps(qdsContext.getDividerBindings(), props)
  return <div {...mergedProps}></div>
}
