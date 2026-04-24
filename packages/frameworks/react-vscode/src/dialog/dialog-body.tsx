import type {ReactElement} from "react"

import {
  CoreDialog,
  type CoreDialogBodyProps,
} from "@qualcomm-ui/react-core/dialog"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export interface DialogBodyProps extends CoreDialogBodyProps {}

/**
 * The main content of the dialog. Container for the heading, description,
 * indicator icon, and primary content of the dialog. Renders a `<div>` element
 * by default.
 */
export function DialogBody(props: DialogBodyProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-dialog__body"}, props)

  return <CoreDialog.Body {...mergedProps} />
}
