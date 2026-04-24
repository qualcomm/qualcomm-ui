import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

/**
 * @public
 * @interface
 */
export type KeybindingProps<C extends As = "span"> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      /**
       * The component used for the root node. It can be a React component or
       * element.
       *
       * @default 'span'
       */
      as?: C

      /**
       * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
       */
      children?: ReactNode
    }
  >

export function Keybinding<C extends As = "span">({
  as,
  children,
  className,
  ...props
}: KeybindingProps<C>): ReactElement {
  const Element = as || "span"
  return (
    <Element className={clsx("vs-keybinding", className)} {...props}>
      {children}
    </Element>
  )
}
