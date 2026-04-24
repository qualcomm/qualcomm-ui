import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface ThProps extends ElementRenderProp<"th"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function Th({children, ...props}: ThProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-th"}, props)

  return (
    <PolymorphicElement as="th" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
