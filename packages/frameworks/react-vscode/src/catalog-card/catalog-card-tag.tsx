import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

/**
 * @public
 * @interface
 */
export type CatalogCardTagProps<C extends As = "div"> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      as?: C
      children?: ReactNode
    }
  >

export function CatalogCardTag<C extends As = "div">({
  as,
  children,
  className,
  ...props
}: CatalogCardTagProps<C>): ReactElement {
  const Element = as || "div"
  return (
    <Element className={clsx("vs-catalog-card--tag", className)} {...props}>
      {children}
    </Element>
  )
}
