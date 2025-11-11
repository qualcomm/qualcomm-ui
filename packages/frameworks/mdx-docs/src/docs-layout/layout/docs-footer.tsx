import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {clsx} from "@qualcomm-ui/utils/clsx"

export type DocsFooterProps = ElementRenderProp<"div"> & {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

// keep this exported separately for compat with older versions.
export function DocsFooter({
  children,
  className,
  ref,
  ...props
}: DocsFooterProps): ReactElement {
  return (
    <PolymorphicElement
      ref={ref}
      as="div"
      className={clsx("qui-docs__footer", className)}
      {...props}
    >
      {children}
    </PolymorphicElement>
  )
}
