import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TableProps extends ElementRenderProp<"table"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function Table({children, ...props}: TableProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-table"}, props)

  return (
    <PolymorphicElement as="table" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
