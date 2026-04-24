import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface CatalogCardTagProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function CatalogCardTag({
  children,
  ...props
}: CatalogCardTagProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-catalog-card__tag"}, props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
