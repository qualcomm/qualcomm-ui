import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"
import {useGroupedChildren} from "@qualcomm-ui/react-core/dom"

/**
 * @public
 * @interface
 */
export type CatalogCardProps<C extends As = "div"> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      /**
       * The component used for the root node. It can be a React component or
       * element.
       *
       * @default 'div'
       */
      as?: C

      /**
       * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
       */
      children?: ReactNode
    }
  >

export function CatalogCard<C extends As = "div">({
  as,
  children: childrenProp,
  className,
  style,
  ...props
}: CatalogCardProps<C>): ReactElement {
  const {children, count} = useGroupedChildren(childrenProp)

  const Element = as || "div"
  return (
    <Element
      className={clsx("vs-catalog-card", className)}
      style={{
        ...style,
        "--child-count": count,
      }}
      {...props}
    >
      {children}
    </Element>
  )
}
