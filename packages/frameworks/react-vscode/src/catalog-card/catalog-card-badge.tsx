import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

/**
 * @public
 * @interface
 */
export type CatalogCardBadgeProps<C extends As = "div"> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      as?: C
      children?: ReactNode
    }
  >

export function CatalogCardBadge<C extends As = "div">({
  as,
  children,
  className,
  ...props
}: CatalogCardBadgeProps<C>): ReactElement {
  const Element = as || "div"
  return (
    <Element className={clsx("vs-catalog-card--badge", className)} {...props}>
      {children}
    </Element>
  )
}
