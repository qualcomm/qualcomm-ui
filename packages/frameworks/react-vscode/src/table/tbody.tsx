import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TbodyProps extends ElementRenderProp<"tbody"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function Tbody({children, ...props}: TbodyProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-tbody"}, props)

  return (
    <PolymorphicElement as="tbody" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
