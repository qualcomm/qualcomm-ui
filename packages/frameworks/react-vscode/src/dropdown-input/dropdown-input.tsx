import type {ReactElement} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"

import {Icon} from "../icon"

import type {DropdownInputVariant} from "./dropdown-input.types"

/**
 * @public
 * @interface
 */
export type DropdownInputProps<C extends As = "button"> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      as?: C
      children?: never

      /**
       * The default label to show when a value isn't selected.
       */
      defaultValue?: string | number

      /**
       * The label to display.
       */
      value?: string | number

      /**
       * The style variant of the dropdown input.
       *
       * @default 'fill'
       */
      variant?: DropdownInputVariant
    }
  >

export function DropdownInput<C extends As = "button">({
  as,
  className,
  defaultValue,
  value: valueProp,
  variant = "fill",
  ...props
}: DropdownInputProps<C>): ReactElement {
  const value = valueProp || defaultValue

  const Element = as || "button"
  return (
    <Element
      className={clsx("vs-dropdown-input", className)}
      data-variant={variant}
      {...props}
    >
      <div className="vs-dropdown-input--label">{value}</div>
      <Icon className="vs-dropdown-input--icon" icon="chevron-down" size={12} />
    </Element>
  )
}
