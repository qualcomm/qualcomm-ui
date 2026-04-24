import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface OptionProps extends ElementRenderProp<"option"> {
  children?: ReactNode
}

export function Option({children, ...props}: OptionProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-option"}, props)

  return (
    <PolymorphicElement as="option" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
