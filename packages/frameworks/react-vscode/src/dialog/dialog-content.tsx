import type {ReactNode} from "react"

import {
  CoreDialog,
  type CoreDialogContentProps,
} from "@qualcomm-ui/react-core/dialog"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export interface DialogContentProps extends CoreDialogContentProps {}

/**
 * A container for the dialog contents. Renders a `<section>` element by
 * default.
 *
 * @example
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Positioner>
 *     <Dialog.Content />
 *   </Dialog.Positioner>
 * </Dialog.Root>
 * ```
 */
export function DialogContent(props: DialogContentProps): ReactNode {
  const mergedProps = mergeProps({className: "vs-dialog__content"}, props)

  return <CoreDialog.Content {...mergedProps} />
}
