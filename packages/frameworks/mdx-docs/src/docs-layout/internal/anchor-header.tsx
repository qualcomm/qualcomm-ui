import {type ReactElement, type ReactNode, useState} from "react"

import {Link2} from "lucide-react"

import {Icon} from "@qualcomm-ui/react/icon"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"

import type {RenderLink} from "../types"

export type AnchorHeaderProps = ElementRenderProp<"span"> & {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Mandatory id, used to generate the anchor link.
   */
  id: string

  /**
   * The function used to render the application's clientside link.
   */
  renderLink: RenderLink
}

/**
 * A simple component that combines
 */
export function AnchorHeader({
  children,
  className,
  id,
  ref,
  renderLink: RenderLink,
  ...props
}: AnchorHeaderProps): ReactElement {
  const [hovered, setHovered] = useState(false)

  return (
    <PolymorphicElement
      ref={ref}
      as="span"
      className={className}
      id={id}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      <RenderLink className="qui-docs-heading" href={`#${id}`}>
        <span className="qui-docs-heading-text">{children}</span>
        {hovered ? <Icon icon={Link2} size="md" /> : null}
      </RenderLink>
    </PolymorphicElement>
  )
}
