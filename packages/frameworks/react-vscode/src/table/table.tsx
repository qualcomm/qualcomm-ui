import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

/**
 * @public
 * @interface
 */
export type TableProps<C extends As = "table"> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      /**
       * The component used for the root node. It can be a React component or
       * element.
       *
       * @default 'table'
       */
      as?: C

      /**
       * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
       */
      children?: ReactNode
    }
  >

export function Table<C extends As = "table">({
  as,
  children,
  className,
  ref,
  ...props
}: TableProps<C>): ReactElement {
  const Element = as || "table"
  return (
    <Element ref={ref} className={clsx("vs-table", className)} {...props}>
      {children}
    </Element>
  )
}
