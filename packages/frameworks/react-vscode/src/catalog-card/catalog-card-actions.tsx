import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

/**
 * @public
 * @interface
 */
export type CatalogCardActionsProps<C extends As = "div"> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      as?: C
      children?: ReactNode
    }
  >

export function CatalogCardActions<C extends As = "div">({
  as,
  children,
  className,
  ...props
}: CatalogCardActionsProps<C>): ReactElement {
  const Element = as || "div"
  return (
    <Element className={clsx("vs-catalog-card--actions", className)} {...props}>
      {children}
    </Element>
  )
}
