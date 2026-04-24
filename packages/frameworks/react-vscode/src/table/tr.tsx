import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

/**
 * @public
 * @interface
 */
export type TrProps<C extends As = "tr"> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * The component used for the root node. It can be a React component or element.
     *
     * @default 'tr'
     */
    as?: C

    /**
     * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
     */
    children?: ReactNode
  }
>

export function Tr<C extends As = "tr">({
  as,
  children,
  className,
  ref,
  ...props
}: TrProps<C>): ReactElement {
  const Element = as || "tr"
  return (
    <Element ref={ref} className={clsx("vs-tr", className)} {...props}>
      {children}
    </Element>
  )
}
