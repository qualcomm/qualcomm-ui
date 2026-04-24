import type {ReactElement, ReactNode} from "react"

import {useSelectErrorText} from "@qualcomm-ui/react-core/select"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface SelectErrorTextProps extends IdProp, ElementRenderProp<"div"> {
  children?: ReactNode
}

export function SelectErrorText({
  children,
  id,
  ...props
}: SelectErrorTextProps): ReactElement {
  const contextProps = useSelectErrorText({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-select__error-text"},
    props,
  )
  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
