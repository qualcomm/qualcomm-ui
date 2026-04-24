import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

/**
 * @public
 * @interface
 */
export type ThProps<C extends As = "th"> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * The component used for the root node. It can be a React component or element.
     *
     * @default 'th'
     */
    as?: C

    /**
     * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
     */
    children?: ReactNode
  }
>

export function Th<C extends As = "th">({
  as,
  children,
  className,
  ref,
  ...props
}: ThProps<C>): ReactElement {
  const Element = as || "th"
  return (
    <Element ref={ref} className={clsx("vs-th", className)} {...props}>
      {children}
    </Element>
  )
}
