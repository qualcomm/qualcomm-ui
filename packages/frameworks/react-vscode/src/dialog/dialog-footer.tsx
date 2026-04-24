import type {ReactElement} from "react"

import {
  CoreDialog,
  type CoreDialogFooterProps,
} from "@qualcomm-ui/react-core/dialog"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export interface DialogFooterProps extends CoreDialogFooterProps {}

/**
 * Content that appears at the bottom of the dialog, typically reserved for
 * actions. Renders a `<div>` element by default.
 */
export function DialogFooter(props: DialogFooterProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-dialog__footer"}, props)

  return <CoreDialog.Footer {...mergedProps} />
}
