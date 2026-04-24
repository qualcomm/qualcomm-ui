import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useTextInputInputGroup} from "@qualcomm-ui/react-core/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TextInputInputGroupProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function TextInputInputGroup({
  children,
  ...props
}: TextInputInputGroupProps): ReactElement {
  const contextProps = useTextInputInputGroup()
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-text-input__input-group"},
    props,
  )
  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
