import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

/**
 * @public
 * @interface
 */
export type InputGroupProps<C extends As = "div"> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      as?: C
      children?: ReactNode
    }
  >

export function InputGroup<C extends As = "div">({
  as,
  children,
  className,
  ...props
}: InputGroupProps<C>): ReactElement {
  const Element = as || "div"
  return (
    <Element className={clsx("vs-input-group", className)} {...props}>
      {children}
    </Element>
  )
}
