import type {ReactElement, ReactNode} from "react"

import {useGroupedChildren} from "@qualcomm-ui/react-core/dom"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface CatalogCardProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CatalogCard({
  children: childrenProp,
  style,
  ...props
}: CatalogCardProps): ReactElement {
  const {children, count} = useGroupedChildren(childrenProp)
  const mergedProps = mergeProps({className: "vs-catalog-card"}, props)

  return (
    <PolymorphicElement
      as="div"
      style={{
        ...style,
        "--child-count": count,
      }}
      {...mergedProps}
    >
      {children}
    </PolymorphicElement>
  )
}
