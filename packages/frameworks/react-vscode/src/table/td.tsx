import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TdProps extends ElementRenderProp<"td"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function Td({children, ...props}: TdProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-td"}, props)

  return (
    <PolymorphicElement as="td" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
