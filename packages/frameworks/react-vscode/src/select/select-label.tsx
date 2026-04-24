import type {ReactElement, ReactNode} from "react"

import {useSelectLabel} from "@qualcomm-ui/react-core/select"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface SelectLabelProps extends IdProp, ElementRenderProp<"label"> {
  children?: ReactNode
}

export function SelectLabel({
  children,
  id,
  ...props
}: SelectLabelProps): ReactElement {
  const contextProps = useSelectLabel({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-select__label"},
    props,
  )
  return (
    <PolymorphicElement as="label" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
