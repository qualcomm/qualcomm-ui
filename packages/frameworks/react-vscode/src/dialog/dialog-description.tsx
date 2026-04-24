import type {ReactElement} from "react"

import {
  CoreDialog,
  type CoreDialogDescriptionProps,
} from "@qualcomm-ui/react-core/dialog"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export interface DialogDescriptionProps extends CoreDialogDescriptionProps {}

/**
 * A description with additional information about the dialog. Renders a
 * `<div>` element by default.
 */
export function DialogDescription(props: DialogDescriptionProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-dialog__description"}, props)

  return <CoreDialog.Description {...mergedProps} />
}
