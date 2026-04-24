import type {ReactElement} from "react"

import {useSelectIndicator} from "@qualcomm-ui/react-core/select"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {Icon} from "../icon"

export interface SelectIndicatorProps extends ElementRenderProp<"span"> {}

export function SelectIndicator({
  children,
  ...props
}: SelectIndicatorProps): ReactElement {
  const contextProps = useSelectIndicator()
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-select__indicator"},
    props,
  )
  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children ?? <Icon icon="chevron-down" size={12} />}
    </PolymorphicElement>
  )
}
