import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface CatalogCardLogoProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function CatalogCardLogo({
  children,
  ...props
}: CatalogCardLogoProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-catalog-card__logo"}, props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
