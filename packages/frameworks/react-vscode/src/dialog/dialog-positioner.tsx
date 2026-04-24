import type {ReactNode} from "react"

import {
  CoreDialog,
  type CoreDialogPositionerProps,
} from "@qualcomm-ui/react-core/dialog"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export interface DialogPositionerProps extends CoreDialogPositionerProps {}

/**
 * A container that positions the dialog on the screen. Renders a `<div>`
 * element by default.
 */
export function DialogPositioner(props: DialogPositionerProps): ReactNode {
  const mergedProps = mergeProps({className: "vs-dialog__positioner"}, props)

  return <CoreDialog.Positioner {...mergedProps} />
}
