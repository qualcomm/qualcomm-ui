import type {ReactElement} from "react"

import {useSelectContext} from "@qualcomm-ui/react-core/select"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface SelectErrorIndicatorProps extends ElementRenderProp<"div"> {}

export function SelectErrorIndicator(
  props: SelectErrorIndicatorProps,
): ReactElement {
  const context = useSelectContext()
  const mergedProps = mergeProps(
    context.getErrorIndicatorBindings(),
    {className: "vs-select__error-indicator"},
    props,
  )
  return <PolymorphicElement as="div" {...mergedProps} />
}
