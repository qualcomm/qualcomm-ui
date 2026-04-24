import type {ReactElement} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

import {sharedClasses} from "../shared"
import type {ButtonVariant} from "../button"
import {type CodiconOrElement, IconOrElement} from "../icon"

/**
 * @public
 * @interface
 */
export type IconButtonProps<C extends As = "button"> =
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
       * Controls the component's interactivity. If `true`, the component is
       * rendered non-interactive and visually dimmed to signal its disabled state.
       */
      disabled?: boolean

      /**
       * If supplied as a `string`, the {@link https://github.com/microsoft/vscode-codicons vscode codicon}
       * will be applied. Supply as a `ReactElement` for additional customization.
       */
      icon: CodiconOrElement

      /**
       * The style variant of the button.
       *
       * @default 'primary'
       */
      variant?: ButtonVariant
    }
  >

export function IconButton<C extends As = "button">({
  as,
  className,
  disabled,
  icon,
  variant,
  ...props
}: IconButtonProps<C>): ReactElement {
  const Element = as || "button"
  return (
    <Element
      className={clsx(
        "vs-button",
        "kind-icon",
        sharedClasses.disabled(disabled),
        className,
      )}
      data-variant={variant}
      disabled={disabled}
      {...props}
    >
      <IconOrElement icon={icon} skipElementWrapper />
    </Element>
  )
}
