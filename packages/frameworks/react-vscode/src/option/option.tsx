import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

/**
 * @public
 * @interface
 */
export type OptionProps<C extends As = "option"> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      as?: C
      children?: ReactNode
    }
  >

export function Option<C extends As = "option">({
  as,
  children,
  className,
  ...props
}: OptionProps<C>): ReactElement {
  const Element = as || "option"
  return (
    <Element className={clsx("vs-option", className)} {...props}>
      {children}
    </Element>
  )
}
