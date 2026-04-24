import type {ReactElement, ReactNode} from "react"

import {useSelectClearTrigger} from "@qualcomm-ui/react-core/select"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {Icon} from "../icon"

export interface SelectClearTriggerProps
  extends IdProp, ElementRenderProp<"button"> {
  children?: ReactNode
}

export function SelectClearTrigger({
  children,
  id,
  ...props
}: SelectClearTriggerProps): ReactElement {
  const contextProps = useSelectClearTrigger({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-select__clear-trigger"},
    props,
  )
  return (
    <PolymorphicElement as="button" {...mergedProps}>
      {children ?? <Icon icon="close" size={12} />}
    </PolymorphicElement>
  )
}
