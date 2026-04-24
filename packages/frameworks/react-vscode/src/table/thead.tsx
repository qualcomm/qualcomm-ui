import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TheadProps extends ElementRenderProp<"thead"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function Thead({children, ...props}: TheadProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-thead"}, props)

  return (
    <PolymorphicElement as="thead" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
