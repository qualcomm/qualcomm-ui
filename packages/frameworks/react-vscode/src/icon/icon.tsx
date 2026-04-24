import type {CSSProperties, ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {clsx} from "@qualcomm-ui/utils/clsx"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import type {Codicon} from "./icon.types"

export interface IconProps extends ElementRenderProp<"span"> {
  /**
   * If `true`, the component will render with an inactive style.
   */
  disabled?: boolean

  /**
   * Specifies the {@link https://microsoft.github.io/vscode-codicons/dist/codicon.html codicon}
   * name to use.
   *
   * @inheritDoc
   */
  icon: Codicon

  /**
   * If `true`, the icon will render with the style of a clickable button. Note
   * that this style is automatically applied if the icon is configured as a
   * `<button />` or `<a />` element via the {@link render} prop.
   */
  isAction?: boolean

  /**
   * Icon size in pixels.
   *
   * @default 16
   */
  size?: number
}

export function Icon({
  disabled,
  icon,
  isAction,
  size = 16,
  style: styleProp,
  ...props
}: IconProps): ReactElement {
  const style = {
    ...styleProp,
    "--vs-icon-size": `${size}px`,
  } as CSSProperties
  const mergedProps = mergeProps(
    {
      className: clsx(`vs-icon__root codicon codicon-${icon}`),
    },
    props,
  )

  return (
    <PolymorphicElement
      aria-disabled={disabled}
      as="span"
      data-action={booleanDataAttr(isAction)}
      data-disabled={booleanDataAttr(disabled)}
      style={style}
      {...mergedProps}
    />
  )
}
