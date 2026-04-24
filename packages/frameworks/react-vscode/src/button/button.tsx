import type {ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

import {sharedClasses} from "../shared"
import {type CodiconOrElement, IconOrElement} from "../icon"

import type {ButtonSize, ButtonVariant} from "./button.types"
import {getIconSizeFromButtonSize} from "./internal"

/**
 * @public
 * @interface
 */
export type ButtonProps<C extends As = "button"> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      /**
       * The component used for the root node. It can be a React component or
       * element.
       *
       * @default 'button'
       */
      as?: C

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
  >

export function Button<C extends As = "button">({
  as,
  children,
  className,
  disabled,
  endIcon,
  size = "md",
  startIcon,
  variant = "primary",
  ...props
}: ButtonProps<C>): ReactNode {
  const Element = as || "button"
  return (
    <Element
      className={clsx(
        "vs-button",
        "kind-text",
        sharedClasses.disabled(disabled),
        className,
      )}
      data-size={size}
      data-variant={variant}
      disabled={disabled}
      {...props}
    >
      {startIcon ? (
        <IconOrElement
          className="vs-button--icon"
          data-start=""
          icon={startIcon}
          size={getIconSizeFromButtonSize(size)}
        />
      ) : null}

      {children}

      {endIcon ? (
        <IconOrElement
          className="vs-button--icon end"
          data-end=""
          icon={endIcon}
          size={getIconSizeFromButtonSize(size)}
        />
      ) : null}
    </Element>
  )
}
