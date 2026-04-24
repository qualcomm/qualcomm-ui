import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import type {ButtonVariant} from "../button"
import {type CodiconOrElement, IconOrElement} from "../icon"

export interface IconButtonProps extends ElementRenderProp<"button"> {
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

export function IconButton({
  disabled,
  icon,
  variant,
  ...props
}: IconButtonProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-button__root"}, props)

  return (
    <PolymorphicElement
      as="button"
      data-disabled={booleanDataAttr(disabled)}
      data-kind="icon"
      data-variant={variant}
      disabled={disabled}
      {...mergedProps}
    >
      <IconOrElement icon={icon} skipElementWrapper />
    </PolymorphicElement>
  )
}
