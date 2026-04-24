import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TrProps extends ElementRenderProp<"tr"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function Tr({children, ...props}: TrProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-tr"}, props)

  return (
    <PolymorphicElement as="tr" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
