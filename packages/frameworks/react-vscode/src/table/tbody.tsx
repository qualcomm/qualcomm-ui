import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

/**
 * @public
 * @interface
 */
export type TbodyProps<C extends As = "tbody"> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      /**
       * The component used for the root node. It can be a React component or
       * element.
       *
       * @default 'tbody'
       */
      as?: C

      /**
       * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
       */
      children?: ReactNode
    }
  >

export function Tbody<C extends As = "tbody">({
  as,
  children,
  className,
  ref,
  ...props
}: TbodyProps<C>): ReactElement {
  const Element = as || "tbody"
  return (
    <Element ref={ref} className={clsx("vs-tbody", className)} {...props}>
      {children}
    </Element>
  )
}
