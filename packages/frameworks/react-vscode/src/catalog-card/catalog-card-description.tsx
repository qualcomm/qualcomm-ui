import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface CatalogCardDescriptionProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function CatalogCardDescription({
  children,
  ...props
}: CatalogCardDescriptionProps): ReactElement {
  const mergedProps = mergeProps(
    {className: "vs-catalog-card__description"},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
