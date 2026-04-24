import type {ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {type CodiconOrElement, IconOrElement} from "../icon"

import type {ButtonSize, ButtonVariant} from "./button.types"
import {getIconSizeFromButtonSize} from "./internal"

export interface ButtonProps extends ElementRenderProp<"button"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * If `true`, the component will not be interactive and will appear dimmed.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * Icon positioned after the children.  If supplied as a `string`, the
   * {@link https://github.com/microsoft/vscode-codicons vscode codicon}
   * will be applied. Supply as a `ReactElement` for additional customization.
   */
  endIcon?: CodiconOrElement

  /**
   * The size of each button.
   *
   * @default 'md'
   */
  size?: ButtonSize

  /**
   * Icon positioned before the children.  If supplied as a `string`, the
   * {@link https://github.com/microsoft/vscode-codicons vscode codicon}
   * will be applied. Supply as a `ReactElement` for additional customization.
   */
  startIcon?: CodiconOrElement

  /**
   * The style variant of the button.
   *
   * @default 'primary'
   */
  variant?: ButtonVariant
}

export function Button({
  children,
  disabled,
  endIcon,
  size = "md",
  startIcon,
  variant = "primary",
  ...props
}: ButtonProps): ReactNode {
  const mergedProps = mergeProps(
    {
      className: "vs-button__root",
    },
    props,
  )
  return (
    <PolymorphicElement
      as="button"
      data-disabled={booleanDataAttr(disabled)}
      data-kind="text"
      data-size={size}
      data-variant={variant}
      disabled={disabled}
      {...mergedProps}
    >
      {startIcon ? (
        <IconOrElement
          className="vs-button__icon"
          data-start
          icon={startIcon}
          size={getIconSizeFromButtonSize(size)}
        />
      ) : null}

      {children}

      {endIcon ? (
        <IconOrElement
          className="vs-button__icon end"
          data-end
          icon={endIcon}
          size={getIconSizeFromButtonSize(size)}
        />
      ) : null}
    </PolymorphicElement>
  )
}
