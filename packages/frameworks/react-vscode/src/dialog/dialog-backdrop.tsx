import type {ReactNode} from "react"

import {
  CoreDialog,
  type CoreDialogBackdropProps,
} from "@qualcomm-ui/react-core/dialog"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export interface DialogBackdropProps extends CoreDialogBackdropProps {}

/**
 * An overlay displayed beneath the dialog to prevent interaction with the rest
 * of the page. Renders a `<div>` element by default.
 */
export function DialogBackdrop(props: DialogBackdropProps): ReactNode {
  const mergedProps = mergeProps({className: "vs-dialog__backdrop"}, props)

  return <CoreDialog.Backdrop {...mergedProps} />
}
