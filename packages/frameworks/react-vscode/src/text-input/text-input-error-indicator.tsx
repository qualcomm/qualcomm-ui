import type {ReactElement} from "react"

import {useTextInputContext} from "@qualcomm-ui/react-core/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TextInputErrorIndicatorProps {
  className?: string
}

export function TextInputErrorIndicator(
  props: TextInputErrorIndicatorProps,
): ReactElement {
  const context = useTextInputContext()
  const mergedProps = mergeProps(
    context.getErrorIndicatorBindings(),
    {className: "vs-text-input__error-indicator"},
    props,
  )
  return <div {...mergedProps} />
}
