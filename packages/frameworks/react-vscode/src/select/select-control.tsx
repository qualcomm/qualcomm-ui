import type {ReactElement, ReactNode} from "react"

import {
  CoreSelect,
  type CoreSelectControlProps,
} from "@qualcomm-ui/react-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {Icon} from "../icon"

import {SelectValueText} from "./select-value-text"

export type SelectControlVariant = "fill" | "ghost"

export interface SelectControlProps extends CoreSelectControlProps {
  children?: ReactNode

  /**
   * The styling variant of the control.
   *
   * @default 'fill'
   */
  variant?: SelectControlVariant
}

export function SelectControl({
  children,
  variant = "fill",
  ...props
}: SelectControlProps): ReactElement {
  const mergedProps = mergeProps(
    {className: "vs-select__control", "data-variant": variant},
    props,
  )
  return (
    <CoreSelect.Control {...mergedProps}>
      {children ?? (
        <>
          <SelectValueText />
          <Icon
            className="vs-select__control__icon"
            icon="chevron-down"
            size={12}
          />
        </>
      )}
    </CoreSelect.Control>
  )
}
