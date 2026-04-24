import type {ReactElement} from "react"

import {
  CoreDialog,
  type CoreDialogCloseTriggerProps,
} from "@qualcomm-ui/react-core/dialog"

/**
 * @public
 */
export interface DialogCloseTriggerProps extends CoreDialogCloseTriggerProps {}

/**
 * A button that closes the dialog. Doesn't render anything by itself. Uses a
 * render prop to spread its props onto the child element.
 *
 * @example
 * ```tsx
 * <Dialog.CloseTrigger>
 *   <button>Close Dialog</button>
 * </Dialog.CloseTrigger>
 * ```
 */
export function DialogCloseTrigger(
  props: DialogCloseTriggerProps,
): ReactElement {
  return <CoreDialog.CloseTrigger {...props} />
}
