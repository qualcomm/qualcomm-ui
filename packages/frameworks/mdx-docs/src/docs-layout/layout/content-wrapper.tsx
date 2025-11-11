import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {clsx} from "@qualcomm-ui/utils/clsx"

export interface ContentWrapperProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode
}

export function ContentWrapper({
  children,
  className,
  ...props
}: ContentWrapperProps): ReactElement {
  return (
    <PolymorphicElement
      as="div"
      className={clsx("qui-docs__content-wrapper", className)}
      {...props}
    >
      {children}
    </PolymorphicElement>
  )
}
