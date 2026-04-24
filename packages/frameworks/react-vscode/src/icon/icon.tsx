import type {CSSProperties, ReactElement} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

import {sharedClasses} from "../shared"

import type {Codicon} from "./icon.types"

/**
 * @public
 * @interface
 */
export type IconProps<C extends As = "span"> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * The component used for the root node. It can be a React component or
     * element.
     *
     * @default 'span'
     */
    as?: C

    /**
     * If `true`, the component will render with an inactive style.
     */
    disabled?: boolean

    /**
     * Specifies the {@link https://microsoft.github.io/vscode-codicons/dist/codicon.html codicon}
     * name to use.
     */
    icon: Codicon

    /**
     * If `true`, the icon will render with the style of a clickable button. Note
     * that this style is automatically applied if the icon is configured as a
     * `button` or `a` element via the {@link as} prop.
     */
    isAction?: boolean

    /**
     * Icon size in pixels.
     *
     * @default 16
     */
    size?: number
  }
>

export function Icon<C extends As = "span">({
  as,
  className,
  disabled,
  icon,
  isAction,
  size = 16,
  style: styleProp,
  ...props
}: IconProps<C>): ReactElement {
  const style = {
    ...styleProp,
    "--vs-icon-size": `${size}px`,
  } as CSSProperties

  const Element = as || "span"
  return (
    <Element
      aria-disabled={disabled}
      className={clsx(
        `vs-icon codicon codicon-${icon}`,
        {action: isAction},
        sharedClasses.disabled(disabled),
        className,
      )}
      style={style}
      {...props}
    />
  )
}
