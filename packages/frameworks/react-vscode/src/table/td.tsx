import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

/**
 * @public
 * @interface
 */
export type TdProps<C extends As = "td"> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * The component used for the root node. It can be a React component or element.
     *
     * @default 'td'
     */
    as?: C

    /**
     * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
     */
    children?: ReactNode
  }
>

export function Td<C extends As = "td">({
  as,
  children,
  className,
  ref,
  ...props
}: TdProps<C>): ReactElement {
  const Element = as || "td"
  return (
    <Element ref={ref} className={clsx("vs-td", className)} {...props}>
      {children}
    </Element>
  )
}
