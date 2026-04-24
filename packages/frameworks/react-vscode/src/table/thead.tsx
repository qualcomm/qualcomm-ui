import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

/**
 * @public
 * @interface
 */
export type TheadProps<C extends As = "thead"> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      /**
       * The component used for the root node. It can be a React component or
       * element.
       *
       * @default 'thead'
       */
      as?: C

      /**
       * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
       */
      children?: ReactNode
    }
  >

export function Thead<C extends As = "thead">({
  as,
  children,
  className,
  ref,
  ...props
}: TheadProps<C>): ReactElement {
  const Element = as || "thead"
  return (
    <Element ref={ref} className={clsx("vs-thead", className)} {...props}>
      {children}
    </Element>
  )
}
